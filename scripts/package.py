"""Create release/SchemaForge_Teslim.zip (top folder SchemaForge/): source, docs, tests, dist build.
Excludes node_modules, .git, test caches, secrets and older releases. Run: python scripts/package.py"""
import re, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'release' / 'SchemaForge_Teslim.zip'
EXCLUDE = re.compile(r'(^|/)(node_modules|\.git|release|test-results|playwright-report|coverage)(/|$)|(^|/)\.env(\..*)?$|\.log$|tsbuildinfo$')
OUT.parent.mkdir(exist_ok=True)
files = [p for p in sorted(ROOT.rglob('*')) if p.is_file() and not EXCLUDE.search(p.relative_to(ROOT).as_posix())]
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for p in files:
        z.write(p, 'SchemaForge/' + p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(OUT) as z:
    bad = z.testzip()
print(f'{OUT}: {len(files)} files, {OUT.stat().st_size / 1048576:.2f} MB, CRC {"OK" if bad is None else "BAD " + bad}')
