"""Verify the SchemaForge delivery (docs consistent with real test output, no fake links, zip clean).
Run: python scripts/verify_delivery.py [--zip]   -> docs/test-results/delivery_verification.txt (or zip_verification.txt)"""
import json
import re
import sys
import time
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
R = []


def check(name, ok, detail):
    R.append((name, bool(ok), detail))


REQUIRED = ['package.json', 'package-lock.json', 'README.md', 'ACTUAL_FEATURES.md', 'DELIVERY_CHECKLIST.md', 'FINAL_REPORT.md', 'LICENSE',
            'netlify.toml', 'public/_redirects', 'index.html', 'vite.config.ts', 'playwright.config.ts', 'eslint.config.js',
            'src/App.tsx', 'src/App.test.tsx', 'src/lib/lib.test.ts', 'src/lib/storage.ts', 'src/lib/validation.ts', 'src/lib/exportSchema.ts',
            'src/interfaces/form.ts', 'e2e/schemaforge.spec.ts', 'docs/TEST_REPORT.md', 'docs/DEPLOYMENT.md',
            'docs/test-results/build.txt', 'docs/test-results/unit-junit.xml', 'docs/test-results/e2e-junit.xml', 'dist/index.html']
missing = [f for f in REQUIRED if not (ROOT / f).is_file()]
check('Required files', not missing, f'{len(REQUIRED) - len(missing)}/{len(REQUIRED)}' + (f'; missing {missing}' if missing else ''))

pkg = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
check('package.json author + scripts', pkg.get('author') == 'Tugay Sinan Ergün' and all(s in pkg['scripts'] for s in ('dev', 'build', 'lint', 'test', 'test:e2e')),
      f"author={pkg.get('author')}; scripts={sorted(pkg['scripts'])}")
deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}
check('Required stack present', all(k in deps for k in ('react', 'typescript', 'vite', 'tailwindcss')) and 'react' in pkg.get('dependencies', {}),
      ', '.join(f'{k} {deps[k]}' for k in ('react', 'typescript', 'vite', 'tailwindcss', 'vitest', '@playwright/test')))

# test numbers in README / TEST_REPORT must equal the JUnit files
def junit(path):
    x = (ROOT / path).read_text(encoding='utf-8')
    cases = re.findall(r'<testcase\b[^>]*?(?:/>|>([\s\S]*?)</testcase>)', x)
    run = [c for c in cases if '<skipped' not in c]
    failed = [c for c in run if '<failure' in c or '<error' in c]
    known = [c for c in run if c not in failed and '<property name="fail"' in c]  # test.fail(): documented, unfixed defect
    return len(run) - len(known), len(failed), len(known)
u_total, u_fail, _ = junit('docs/test-results/unit-junit.xml')
e_total, e_fail, e_known = junit('docs/test-results/e2e-junit.xml')
check('Unit/integration tests (JUnit)', u_total >= 30 and u_fail == 0, f'{u_total} run, {u_fail} failed')
check('Browser tests (JUnit)', e_total >= 4 and e_fail == 0, f'{e_total} run, {e_fail} failed (skips excluded); {e_known} known-defect tests (test.fail) not counted as passed')
readme = (ROOT / 'README.md').read_text(encoding='utf-8'); report = (ROOT / 'docs/TEST_REPORT.md').read_text(encoding='utf-8')
check('README/TEST_REPORT numbers match JUnit', f'| {u_total}/{u_total} |' in readme and f'| {e_total}/{e_total} ' in readme
      and f'{u_total} test · {u_total} başarılı' in report and f'{e_total + e_known} test · {e_total} başarılı · {e_known} bilinen kusur' in report,
      f'unit {u_total}, e2e {e_total} + {e_known} known defects')
build = (ROOT / 'docs/test-results/build.txt').read_text(encoding='utf-8')
check('npm run build output recorded and successful', '# exit: 0' in build and 'built in' in build, 'docs/test-results/build.txt')
for name in ('typecheck', 'lint'):
    t = (ROOT / f'docs/test-results/{name}.txt').read_text(encoding='utf-8')
    check(f'{name} clean', '# exit: 0' in t, f'docs/test-results/{name}.txt')

shots = sorted((ROOT / 'docs/screenshots').glob('*.png'))
sizes = [Image.open(s).size for s in shots]
check('Real screenshots (desktop + mobile)', len(shots) >= 6 and any(w >= 1440 for w, _ in sizes) and any(w == 780 for w, _ in sizes),
      f'{len(shots)} PNG; sizes {sorted(set(sizes))[:4]}...')

# features file uses only the four allowed statuses
af = (ROOT / 'ACTUAL_FEATURES.md').read_text(encoding='utf-8')
rows = [r for r in re.findall(r'^\| ([FPU]\d+) \| [^|]+ \| ([^|]+) \|', af, re.M)]
allowed = {'Implemented and tested', 'Implemented but not tested', 'Planned', 'Unsupported'}
bad = [r for r in rows if r[1].strip() not in allowed]
check('ACTUAL_FEATURES statuses valid', rows and not bad, f'{len(rows)} items; ' + ', '.join(f'{s}: {sum(1 for _, x in rows if x.strip() == s)}' for s in sorted(allowed)))

# every GitHub / Netlify link in the delivery documents must really answer (no invented links)
import urllib.request
text = readme + (ROOT / 'FINAL_REPORT.md').read_text(encoding='utf-8') + (ROOT / 'DELIVERY_CHECKLIST.md').read_text(encoding='utf-8') + (ROOT / 'docs/DEPLOYMENT.md').read_text(encoding='utf-8')
links = sorted(set(re.findall(r'https://[a-z0-9-]+\.netlify\.app/?|https://github\.com/TCoderr/[A-Za-z0-9_.-]+', text)))
status = {}
for u in links:
    try:
        status[u] = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'verify'}), timeout=20).status
    except Exception as e:  # noqa: BLE001
        status[u] = getattr(e, 'code', str(e)[:40])
check('All GitHub/Netlify links in the docs are live (HTTP 200)', links and all(c == 200 for c in status.values()), ', '.join(f'{u} -> {c}' for u, c in status.items()))
live_junit = ROOT / 'docs/test-results/e2e-live-junit.xml'
if live_junit.exists():
    l_total, l_fail, l_known = junit('docs/test-results/e2e-live-junit.xml')
    check('Browser tests against the live Netlify site', l_total >= 4 and l_fail == 0, f'{l_total} run, {l_fail} failed, {l_known} known-defect tests')

src_text = '\n'.join(p.read_text(encoding='utf-8') for p in (ROOT / 'src').rglob('*.tsx'))
check('No dangerouslySetInnerHTML in source', 'dangerouslySetInnerHTML' not in src_text, 'none')

if '--zip' in sys.argv:
    z_path = ROOT / 'release/SchemaForge_Teslim.zip'
    with zipfile.ZipFile(z_path) as z:
        bad_crc = z.testzip(); names = z.namelist()
    leaked = [n for n in names if re.search(r'(^|/)(node_modules|\.git|\.netlify)/|(^|/)\.env', n)]
    miss = [f for f in REQUIRED if f'SchemaForge/{f}' not in names]
    check('ZIP integrity and contents', bad_crc is None and not leaked and not miss,
          f'{len(names)} files, {z_path.stat().st_size / 1048576:.2f} MB, CRC ok={bad_crc is None}, leaked={leaked[:3] or "none"}, missing={miss or "none"}')
    # same version everywhere: ZIP source == git HEAD (line endings ignored), ZIP dist == what Netlify serves
    import hashlib, subprocess
    head = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    tracked = set(subprocess.run(['git', 'ls-files'], cwd=ROOT, capture_output=True, text=True).stdout.split('\n'))
    with zipfile.ZipFile(z_path) as z:
        src = [n for n in names if n.startswith('SchemaForge/') and n[12:] in tracked]
        differs = [n for n in src if z.read(n).replace(b'\r\n', b'\n') !=
                   subprocess.run(['git', 'show', f'HEAD:{n[12:]}'], cwd=ROOT, capture_output=True).stdout.replace(b'\r\n', b'\n')]
        dist = {n[len('SchemaForge/dist/'):]: hashlib.sha256(z.read(n)).hexdigest() for n in names if n.startswith('SchemaForge/dist/') and not n.endswith(('index.html', '_redirects'))}
    live = {}
    for rel in dist:
        try:
            live[rel] = hashlib.sha256(urllib.request.urlopen(f'https://schemaforge-tcoderr.netlify.app/{rel}', timeout=20).read()).hexdigest()
        except Exception as e:  # noqa: BLE001
            live[rel] = str(e)[:40]
    check('ZIP source == git HEAD', src and not differs, f'HEAD {head[:7]}; {len(src) - len(differs)}/{len(src)} tracked files identical (line endings ignored)' + (f'; DIFFER {differs[:5]}' if differs else ''))
    check('ZIP dist == live Netlify files', dist and all(live[k] == v for k, v in dist.items()),
          '; '.join(f'{k} {v[:12]} {"==" if live[k] == v else "!= " + live[k][:12]} live' for k, v in sorted(dist.items())))

ok = all(r[1] for r in R)
lines = ['SchemaForge - Delivery Verification', f'Generated: {time.strftime("%Y-%m-%d %H:%M:%S")}', '']
lines += [f'[{"PASS" if r[1] else "FAIL"}] {r[0]}: {r[2]}' for r in R] + ['', f'OVERALL: {"PASS" if ok else "FAIL"} ({sum(r[1] for r in R)}/{len(R)})']
(ROOT / 'docs/test-results' / ('zip_verification.txt' if '--zip' in sys.argv else 'delivery_verification.txt')).write_text('\n'.join(lines) + '\n', encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8'); print('\n'.join(lines)); sys.exit(0 if ok else 1)
