import { Bash } from 'just-bash'
import { createBashTool } from 'bash-tool'
import * as fs from 'fs'
import * as path from 'path'

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge')
const WORKSPACE = '/workspace'

let bashToolInstance: Awaited<ReturnType<typeof createBashTool>> | null = null
let cachedFiles: Record<string, string> | null = null
let cachedFilenames: string[] | null = null

// Recorre knowledge/indicadores, knowledge/estudios y knowledge/practicas
// y carga cada .txt como un archivo dentro del filesystem virtual, usando
// una ruta tipo "indicadores/Indicador_1.txt" para que el modelo sepa a
// qué categoria pertenece cada documento.
function loadFiles(): Record<string, string> {
  if (cachedFiles) return cachedFiles

  const files: Record<string, string> = {}

  try {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      console.log('[BashTool] Directorio de conocimiento no existe aun')
      return files
    }

    const categorias = fs.readdirSync(KNOWLEDGE_DIR, { withFileTypes: true })

    for (const categoria of categorias) {
      if (!categoria.isDirectory()) continue
      const categoriaPath = path.join(KNOWLEDGE_DIR, categoria.name)
      const entries = fs.readdirSync(categoriaPath)

      for (const entry of entries) {
        if (!entry.endsWith('.txt')) continue
        const filePath = path.join(categoriaPath, entry)
        const content = fs.readFileSync(filePath, 'utf-8')
        // Se guarda con la ruta completa (categoria/archivo.txt) para busquedas
        // organizadas, Y TAMBIEN con solo el nombre del archivo en la raiz,
        // por si el modelo omite la subcarpeta al escribir el comando (ej.
        // "cat archivo.txt" en vez de "cat practicas/archivo.txt"). No hay
        // colisiones de nombres entre categorias (verificado al generar los datos).
        files[`${categoria.name}/${entry}`] = content
        files[entry] = content
      }
    }

    console.log(`[BashTool] Cargados ${Object.keys(files).length} rutas de archivo en filesystem virtual`)
  } catch (error) {
    console.error('[BashTool] Error cargando archivos:', error)
  }

  cachedFiles = files
  cachedFilenames = Object.keys(files)
  return files
}

export function getFileList(): string[] {
  if (cachedFilenames) return cachedFilenames
  loadFiles()
  return cachedFilenames || []
}

export async function getBashTool() {
  if (bashToolInstance) {
    return bashToolInstance
  }

  const files = loadFiles()

  const absoluteFiles: Record<string, string> = {}
  for (const [name, content] of Object.entries(files)) {
    absoluteFiles[`${WORKSPACE}/${name}`] = content
  }

  const bashInstance = new Bash({
    files: absoluteFiles,
    cwd: WORKSPACE,
    defenseInDepth: false,
  })

  bashToolInstance = await createBashTool({
    sandbox: bashInstance,
    destination: WORKSPACE,
  })

  return bashToolInstance
}

export async function getBashToolInstructions(): Promise<string> {
  const files = loadFiles()
  const filenames = Object.keys(files).filter(f => f.includes('/'))

  if (filenames.length === 0) {
    return `## Base de conocimiento no disponible\n\nNo se encontraron documentos del Observatorio cargados.`
  }

  return `## Herramienta Bash Disponible

Tienes acceso a un terminal bash virtual con la base de conocimiento del Observatorio
de Genero en Educacion Superior (PUCP), organizada en tres carpetas:

- /workspace/indicadores/  -> series de datos estadisticos (matricula, graduacion, docencia, investigacion, liderazgo, etc.), un archivo por indicador
- /workspace/estudios/     -> investigaciones y articulos academicos sobre genero en educacion superior, un archivo por estudio
- /workspace/practicas/    -> buenas practicas y programas de intervencion implementados en universidades, un archivo por practica

### ARCHIVOS DISPONIBLES:
${filenames.map(f => `- ${f}`).join('\n')}

### COMANDOS UTILES:
- ls /workspace/indicadores: ver todos los indicadores disponibles
- ls /workspace/estudios: ver todos los estudios disponibles
- ls /workspace/practicas: ver todas las practicas disponibles
- cat /workspace/indicadores/Indicador_1.txt: leer un indicador completo
- grep -ril "palabra clave" /workspace: buscar en TODOS los documentos (recursivo, sin importar mayusculas/minusculas), lista los archivos que coinciden
- grep -il "palabra clave" /workspace/estudios/*.txt: buscar solo dentro de estudios
- find /workspace -name "*.txt": listar todos los archivos disponibles
- ls /workspace/estudios | wc -l: CONTAR cuantos estudios hay (usa esto para preguntas de "cuantos", no leas archivo por archivo)

### FLUJO DE TRABAJO:
1. Si la pregunta es sobre un dato/cifra concreta: busca en /workspace/indicadores
2. Si la pregunta es sobre investigacion academica o evidencia: busca en /workspace/estudios
3. Si la pregunta es sobre programas o intervenciones exitosas: busca en /workspace/practicas
4. Usa grep para encontrar el archivo relevante, luego cat para leerlo completo
5. DESPUES de leer la informacion, SIEMPRE da una respuesta final citando la fuente exacta (nombre del indicador, titulo del estudio o de la practica)

### EJEMPLO:
Usuario: "¿Cual es la brecha de matricula femenina en STEM?"
Tu: grep -l "STEM" /workspace/indicadores/*.txt -> cat del archivo encontrado -> Respondes citando el indicador y la fuente (ej. SUNEDU, UNESCO)

IMPORTANTE: Nunca inventes cifras ni estudios. Si no encuentras informacion relevante en la base de conocimiento, dilo claramente en vez de inventar una respuesta.`
}
