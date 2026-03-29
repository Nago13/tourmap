import OpenAI from 'openai'

export const MODEL = 'gpt-4o'

export function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })
}
