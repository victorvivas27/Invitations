import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const [moduleName, workspace = process.cwd()] = process.argv.slice(2)
const summaryFile = process.env.GITHUB_STEP_SUMMARY

if (!summaryFile) process.exit(0)

const percentage = (covered, missed) => {
  const total = covered + missed
  return total ? `${((covered / total) * 100).toFixed(1)}%` : '—'
}

const badge = (value, target) => (value >= target ? '✅' : '⚠️')
let markdown = ''

if (moduleName === 'frontend') {
  const coveragePath = join(workspace, 'coverage', 'coverage-summary.json')
  const resultsPath = join(workspace, 'test-results.json')

  if (!existsSync(coveragePath)) {
    markdown = '## 🎨 Frontend · reporte de calidad\n\n⚠️ No se generó el reporte de cobertura.\n'
  } else {
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8')).total
    const results = existsSync(resultsPath)
      ? JSON.parse(readFileSync(resultsPath, 'utf8'))
      : {}
    const tests = results.numTotalTests ?? '—'
    const passed = results.numPassedTests ?? '—'
    const failed = results.numFailedTests ?? '—'

    markdown = `## 🎨 Frontend · reporte de calidad

> Resumen automático de Vitest y cobertura V8.

| Estado | Tests | Aprobados | Fallidos |
| :---: | ---: | ---: | ---: |
| ${failed === 0 ? '✅ Correcto' : '❌ Revisar'} | ${tests} | ${passed} | ${failed} |

| Métrica | Cobertura |
| --- | ---: |
| Líneas | **${coverage.lines.pct}%** |
| Funciones | **${coverage.functions.pct}%** |
| Ramas | **${coverage.branches.pct}%** |
| Declaraciones | **${coverage.statements.pct}%** |

📦 El artefacto **frontend-quality-report** contiene el reporte HTML navegable.
`
  }
}

if (moduleName === 'backend') {
  const jacocoPath = join(
    workspace,
    'build',
    'reports',
    'jacoco',
    'test',
    'jacocoTestReport.xml',
  )
  const resultsDirectory = join(workspace, 'build', 'test-results', 'test')

  if (!existsSync(jacocoPath)) {
    markdown = '## ☕ Backend · reporte de calidad\n\n⚠️ No se generó el reporte JaCoCo.\n'
  } else {
    const xml = readFileSync(jacocoPath, 'utf8')
    const counters = [...xml.matchAll(/<counter type="([A-Z]+)" missed="(\d+)" covered="(\d+)"\/>/g)]
    const totals = Object.fromEntries(
      counters.slice(-6).map((match) => [
        match[1],
        { missed: Number(match[2]), covered: Number(match[3]) },
      ]),
    )

    let tests = 0
    let failures = 0
    let errors = 0
    let skipped = 0
    try {
      const { readdirSync } = await import('node:fs')
      for (const file of readdirSync(resultsDirectory).filter((name) => name.startsWith('TEST-'))) {
        const suite = readFileSync(join(resultsDirectory, file), 'utf8').match(/<testsuite[^>]+>/)?.[0] ?? ''
        const value = (name) => Number(suite.match(new RegExp(`${name}="(\\d+)"`))?.[1] ?? 0)
        tests += value('tests')
        failures += value('failures')
        errors += value('errors')
        skipped += value('skipped')
      }
    } catch {
      // El resumen de cobertura sigue siendo útil aunque falten resultados XML.
    }

    const lineValue = Number(percentage(totals.LINE.covered, totals.LINE.missed).replace('%', ''))
    markdown = `## ☕ Backend · reporte de calidad

> Resumen automático de JUnit, JaCoCo y PMD. Cobertura mínima requerida: **50%**.

| Estado | Tests | Aprobados | Fallidos | Omitidos |
| :---: | ---: | ---: | ---: | ---: |
| ${failures + errors === 0 ? '✅ Correcto' : '❌ Revisar'} | ${tests} | ${tests - failures - errors - skipped} | ${failures + errors} | ${skipped} |

| Métrica | Cobertura | Umbral |
| --- | ---: | :---: |
| Líneas | **${percentage(totals.LINE.covered, totals.LINE.missed)}** | ${badge(lineValue, 50)} |
| Instrucciones | **${percentage(totals.INSTRUCTION.covered, totals.INSTRUCTION.missed)}** | ${badge(Number(percentage(totals.INSTRUCTION.covered, totals.INSTRUCTION.missed).replace('%', '')), 50)} |
| Ramas | **${percentage(totals.BRANCH.covered, totals.BRANCH.missed)}** | Informativo |
| Métodos | **${percentage(totals.METHOD.covered, totals.METHOD.missed)}** | Informativo |
| Clases | **${percentage(totals.CLASS.covered, totals.CLASS.missed)}** | Informativo |

✅ El workflow también ejecuta la verificación de cobertura y las reglas PMD.

📦 El artefacto **backend-quality-report** contiene los reportes HTML navegables.
`
  }
}

appendFileSync(summaryFile, `${markdown}\n`)
