import { chmod, cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

async function build() {
  await esbuild.build({
    entryPoints: [join(projectRoot, 'src/main.ts')],
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    outfile: 'bin/cli.mjs',
    banner: {
      js: "#!/usr/bin/env node\nimport { createRequire } from 'module';const require = createRequire(import.meta.url);"
    },
    external: ['util', '@notionhq/client', '@modelcontextprotocol/sdk', '@n24q02m/hull']
  })

  // Make the output file executable
  await chmod('./bin/cli.mjs', 0o755)

  // Copy docs to build folder for resources
  await cp(join(projectRoot, 'src/docs'), join(projectRoot, 'build/src/docs'), { recursive: true })

  console.log('CLI built successfully: bin/cli.mjs')
  console.log('Documentation copied to build/src/docs/')
}

build().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
