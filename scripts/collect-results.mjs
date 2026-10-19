// Runs typecheck, lint, unit tests, build and E2E tests, stores their real output under docs/test-results
// and writes docs/TEST_REPORT.md from the JUnit XML files. Usage: node scripts/collect-results.mjs
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const OUT = 'docs/test-results'
mkdirSync(OUT, { recursive: true })
const run = (name, cmd) => {
  let out, ok = true
  try { out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } }) }
  catch (e) { out = `${e.stdout ?? ''}${e.stderr ?? ''}`; ok = false }
  const clean = out.replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter((l) => !l.startsWith('npm notice')).join('\n')
  writeFileSync(`${OUT}/${name}.txt`, `$ ${cmd}\n# exit: ${ok ? 0 : 'non-zero'}\n\n${clean}`)
  console.log(`${name}: ${ok ? 'OK' : 'FAILED'}`)
  return ok
}
const results = {
  typecheck: run('typecheck', 'npx tsc -b --pretty false'),
  lint: run('lint', 'npx eslint .'),
  unit: run('unit-tests', `npx vitest run --reporter=default --reporter=junit --outputFile.junit=${OUT}/unit-junit.xml`),
  build: run('build', 'npm run build'),
  e2e: run('e2e-tests', 'npx playwright test'),
}

function junit(file) {
  const xml = readFileSync(file, 'utf8')
  const cases = [...xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)].map((m) => {
    const attr = (k) => (m[1].match(new RegExp(`${k}="([^"]*)"`)) ?? [])[1] ?? ''
    const body = m[3] ?? ''
    const status = /<failure|<error/.test(body) ? 'BAŞARISIZ' : /<skipped/.test(body) ? 'ATLANDI' : 'BAŞARILI'
    return { name: attr('name').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'), suite: attr('classname'), time: Number(attr('time')), status }
  })
  return cases
}
const unit = junit(`${OUT}/unit-junit.xml`)
const e2e = junit(`${OUT}/e2e-junit.xml`).filter((c) => c.status !== 'ATLANDI')
const count = (cs) => `${cs.length} test · ${cs.filter((c) => c.status === 'BAŞARILI').length} başarılı · ${cs.filter((c) => c.status === 'BAŞARISIZ').length} başarısız`
const build = readFileSync(`${OUT}/build.txt`, 'utf8').split('\n').filter((l) => /dist\/|built in/.test(l)).join('\n')
const md = [
  '# SchemaForge — Test Raporu', '',
  `**Oluşturma:** ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC · **Komut:** \`node scripts/collect-results.mjs\``, '',
  '| Kontrol | Sonuç | Ham çıktı |', '|---|---|---|',
  `| TypeScript (\`tsc -b\`) | ${results.typecheck ? 'Hatasız' : 'HATA'} | \`docs/test-results/typecheck.txt\` |`,
  `| ESLint | ${results.lint ? 'Hatasız' : 'HATA'} | \`docs/test-results/lint.txt\` |`,
  `| Birim + entegrasyon (Vitest + React Testing Library) | ${count(unit)} | \`docs/test-results/unit-tests.txt\`, \`unit-junit.xml\` |`,
  `| \`npm run build\` | ${results.build ? 'Başarılı' : 'HATA'} | \`docs/test-results/build.txt\` |`,
  `| Tarayıcı (Playwright + Microsoft Edge) | ${count(e2e)} | \`docs/test-results/e2e-tests.txt\`, \`e2e-junit.xml\` |`, '',
  '## Build çıktısı', '', '```', build, '```', '',
  '## Birim ve entegrasyon testleri', '', '| # | Test | Sonuç | Süre (sn) |', '|---|---|---|---|',
  ...unit.map((c, i) => `| ${i + 1} | ${c.suite.replace(/^src\//, '')} › ${c.name} | ${c.status} | ${c.time.toFixed(3)} |`), '',
  '## Tarayıcı testleri (gerçek Edge, üretim derlemesi `vite preview`)', '', '| # | Test | Sonuç | Süre (sn) |', '|---|---|---|---|',
  ...e2e.map((c, i) => `| ${i + 1} | ${c.name} | ${c.status} | ${c.time.toFixed(3)} |`), '',
  'Ekran görüntüleri tarayıcı testleri sırasında gerçek Edge penceresinden alınır: `docs/screenshots/`.',
].join('\n')
writeFileSync('docs/TEST_REPORT.md', md + '\n')
const allOk = Object.values(results).every(Boolean) && [...unit, ...e2e].every((c) => c.status === 'BAŞARILI')
console.log(allOk ? 'ALL OK' : 'SOMETHING FAILED')
process.exit(allOk ? 0 : 1)
