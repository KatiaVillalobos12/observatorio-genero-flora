import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, toUIMessageStream, UIMessage } from 'ai'
import { createOpenRouter, DEFAULT_MODEL } from '@/lib/openrouter'
import { getBashTool, getBashToolInstructions } from '@/lib/bash-tool'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, apiKey, model }: { messages: UIMessage[]; apiKey: string; model?: string } = await req.json()

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const openrouter = createOpenRouter(apiKey)
    const selectedModel = model || DEFAULT_MODEL

    const { tools } = await getBashTool()
    const bashInstructions = await getBashToolInstructions()

    const result = streamText({
      model: openrouter(selectedModel),
      system: `${bashInstructions}

## ROL E INSTRUCCIONES

Eres Flora, el asistente virtual del Observatorio de Genero en Educacion Superior de la PUCP
(Oficina para la Igualdad de Genero y Diversidad - OIGD). Tu nombre es un homenaje a Flora
Tristan, pensadora y pionera del feminismo peruano. Ayudas a estudiantes, investigadores/as y
personal de la universidad a encontrar indicadores, estudios y buenas practicas sobre igualdad
de genero en la educacion superior.

### REGLAS IMPORTANTES:
1. SIEMPRE responde en espanol
2. SIEMPRE usa la herramienta bash para buscar informacion antes de responder
3. DESPUES de usar la herramienta, DEBES dar una respuesta final al usuario
4. SIEMPRE cita la fuente exacta de donde sacaste el dato (nombre del indicador y fuente original como SUNEDU/UNESCO/OCDE, o titulo del estudio/practica)
5. Si no encuentras informacion relevante, dilo claramente. NUNCA inventes cifras, estudios o practicas
6. Resume la informacion de forma clara, concisa y accesible (evita jerga estadistica innecesaria)

### EJEMPLO DE FLUJO CORRECTO:
Usuario: "¿Cual es la brecha de matricula femenina en carreras STEM?"
Paso 1: Ejecutas grep -ril "STEM" /workspace/indicadores
Paso 2: Lees el archivo encontrado con cat
Paso 3: Respondes citando la cifra exacta, el año y la fuente (ej. "Segun UNESCO...")

NO te quedes solo ejecutando comandos. SIEMPRE genera una respuesta final para el usuario.`,
      messages: await convertToModelMessages(messages),
      tools: { bash: tools.bash },
      toolChoice: 'auto',
      stopWhen: isStepCount(10),
      onError: (error) => {
        console.error('Stream error:', error)
      },
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    })
  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
