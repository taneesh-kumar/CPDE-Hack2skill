import { GoogleGenAI } from '@google/genai'

let cachedClient = null
let cachedKey = null

function getClient(apiKey) {
  if (cachedClient && cachedKey === apiKey) return cachedClient
  cachedKey = apiKey
  cachedClient = new GoogleGenAI({ apiKey })
  return cachedClient
}

function extractText(response) {
  if (!response) return ''

  if (typeof response.text === 'string') return response.text
  if (typeof response.text === 'function') {
    try {
      const v = response.text()
      return typeof v === 'string' ? v : ''
    } catch {
      return ''
    }
  }

  // Fallback for older/alternate response shapes
  const parts = response?.candidates?.[0]?.content?.parts
  const first = Array.isArray(parts) ? parts[0]?.text : undefined
  return typeof first === 'string' ? first : ''
}

export async function generatePlainEnglishRiskExplanation({ zoneId, level, signal, suggestedAction }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  // Safe demo fallback when key isn't set.
  if (!apiKey) {
    return `Zone ${zoneId} risk is ${level}. ${signal} Suggested action: ${suggestedAction}`
  }

  // NOTE: Client-side Gemini calls are fine for demos.
  // For production, proxy through a server to protect keys.
  const prompt =
    `You are an agronomy assistant. Write 2 short sentences in plain English for a non-technical farmer. ` +
    `Avoid jargon, keep it calm and actionable.\n\n` +
    `Zone: ${zoneId}\nRisk: ${level}\nSignal: ${signal}\nSuggested action: ${suggestedAction}`

  const ai = getClient(apiKey)

  const request = {
    model: 'gemini-2.5-flash',
    contents: prompt,
    generationConfig: { temperature: 0.4, maxOutputTokens: 120 },
  }

  try {
    const response = await ai.models.generateContent(request)
    const text = extractText(response)
    return text?.trim() || `Zone ${zoneId} risk is ${level}. ${suggestedAction}`
  } catch (err) {
    // Backward-compatible fallback in case the project/key doesn't have access to 2.5.
    try {
      const response = await ai.models.generateContent({ ...request, model: 'gemini-1.5-flash' })
      const text = extractText(response)
      return text?.trim() || `Zone ${zoneId} risk is ${level}. ${suggestedAction}`
    } catch {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`[CPDE] Gemini request failed: ${message}`)
    }
  }
}
