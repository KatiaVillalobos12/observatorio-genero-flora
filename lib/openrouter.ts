import { createOpenAI } from '@ai-sdk/openai'

export interface ModelInfo {
  id: string
  name: string
  context: string
  toolCall: boolean
  paid?: boolean
}

export function createOpenRouter(apiKey?: string) {
  return createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || '',
  })
}

export const FREE_MODELS: ModelInfo[] = [
  // Router automático: el catálogo de modelos :free de OpenRouter cambia
  // constantemente (varios dejaron de ser gratis en cuestion de minutos
  // durante las pruebas de este proyecto), asi que fijar un modelo especifico
  // no es confiable. Este router elige en tiempo real entre los modelos
  // gratuitos vigentes que soportan tool calling.
  { id: 'openrouter/free', name: 'Auto (recomendado)', context: 'variable', toolCall: true },

  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', context: '131K', toolCall: true },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B', context: '131K', toolCall: true },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron 3 Ultra (550B)', context: '1M', toolCall: true },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', context: '131K', toolCall: true },
]

export const DEFAULT_MODEL = 'openrouter/free'
