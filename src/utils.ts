import { runCopilotMicrosoft } from './scripts/copilot-microsoft'
import { runDeepSeek } from './scripts/deepseek'
import { Profile } from './types'

export const websites = [
  { name: 'DeepSeek', url: 'chat.deepseek.com', run: runDeepSeek },
  {
    name: 'Microsoft Copilot',
    url: 'copilot.microsoft.com',
    run: runCopilotMicrosoft,
  },
  {
    name: 'Gemini',
    url: 'gemini.google.com',
    run: () => {},
  },
]

export const $ = (selector: string) => document.querySelector(selector)
export const $$ = (selector: string) => document.querySelectorAll(selector)

export function getEnabledSites(): Promise<Record<string, boolean>> {
  return new Promise(resolve => {
    chrome.storage.local.get(['enabledSites'], result => {
      if (result.enabledSites) {
        resolve(result.enabledSites)
      } else {
        const initialState = Object.fromEntries(
          websites.map(site => [site.name, true])
        )
        chrome.storage.local.set({ enabledSites: initialState }, () => {
          resolve(initialState)
        })
      }
    })
  })
}

export async function getStoredProfile(): Promise<Profile | null> {
  return new Promise(resolve => {
    chrome.storage.local.get('aiProfile', result => {
      resolve(result.aiProfile ?? null)
    })
  })
}

export function getPrePrompt(profile: Profile): string {
  const lines: string[] = []

  const { name, job, extra, traits } = profile

  if (name.trim()) lines.push(`My name is ${name}`)
  if (job.trim()) lines.push(`I work as ${job}`)
  if (extra.trim()) lines.push(`More about me: ${extra}`)
  if (traits.trim()) lines.push(`I expect from you: ${traits}`)

  return lines.length ? `${lines.join('.\n')}.\n--------------------\n` : ''
}

export async function getPrePrompt2(): Promise<string> {
  const profile = await getStoredProfile()
  if (!profile) return ''

  const lines: string[] = []
  const { name, job, extra, traits } = profile

  if (name.trim()) lines.push(`My name is ${name}`)
  if (job.trim()) lines.push(`I work as ${job}`)
  if (extra.trim()) lines.push(`More about me: ${extra}`)
  if (traits.trim()) lines.push(`I expect from you: ${traits}`)

  return lines.length ? `${lines.join('.\n')}.\n--------------------\n` : ''
}
