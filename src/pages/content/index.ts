import { copilotMicrosoftCommands } from '@src/scripts/copilot-microsoft'
import { deepSeekCommands } from '@src/scripts/deepseek'
import { geminiCommands } from '@src/scripts/gemini'
import { getEnabledSites, websites } from '@src/utils'

const commands = [
  {
    command: 'Open new chat',
    keybinding: 'ctrl + shift + o',
  },
  {
    command: 'Toggle sidebar',
    keybinding: 'ctrl + shift + s',
  },
  {
    command: 'Focus chat input',
    keybinding: 'shift + escape',
  },
  {
    command: 'Copy last code block',
    keybinding: 'ctrl + shift + :',
  },
]

function parseKeybinding(binding: string): Set<string> {
  return new Set(
    binding
      .toLowerCase()
      .split('+')
      .map(k => k.trim())
  )
}

function isKeyMatch(event: KeyboardEvent, keys: Set<string>): boolean {
  const eventKeys = new Set<string>()

  if (event.ctrlKey) eventKeys.add('ctrl')
  if (event.shiftKey) eventKeys.add('shift')
  if (event.altKey) eventKeys.add('alt')
  if (event.metaKey) eventKeys.add('meta') // for macOS cmd

  // Normalize and add the key
  const key = event.key.toLowerCase()
  if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
    eventKeys.add(key)
  }

  // Must match in both directions
  return keys.size === eventKeys.size && [...keys].every(k => eventKeys.has(k))
}

async function main() {
  console.log('MAIN FUNCTION LOADED SUCCESSFUL')
  const hostname = window.location.hostname.toLowerCase()

  // get enabled sites from storage
  const enabledSites = await getEnabledSites()

  for (const [siteName, isEnabled] of Object.entries(enabledSites)) {
    console.log(siteName, isEnabled)
    if (
      hostname.startsWith(websites.find(w => w.name === siteName)?.url!!) &&
      !isEnabled
    ) {
      return // exit the main function
    }
  }

  window.addEventListener('keydown', event => {
    for (const { command, keybinding } of commands) {
      const bindingKeys = parseKeybinding(keybinding)
      if (isKeyMatch(event, bindingKeys)) {
        event.preventDefault() // avoid default browser/website actions
        console.log({
          command,
          keybinding,
        })

        switch (window.location.hostname) {
          case 'chat.deepseek.com':
            deepSeekCommands.find(c => c.command === command)?.action()

            break
          case 'copilot.microsoft.com':
            copilotMicrosoftCommands.find(c => c.command === command)?.action()

            break
          case 'gemini.google.com':
            geminiCommands.find(c => c.command === command)?.action()
        }
      }
    }
  })

  const matchedSite = websites.find(s => hostname.startsWith(s.url))

  if (matchedSite) {
    matchedSite.run()

    let lastPath = window.location.pathname

    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname
      if (currentPath !== lastPath) {
        lastPath = currentPath
        console.log('Detected route change:', currentPath)
        matchedSite.run()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main)
} else {
  main()
}

console.log('CONTENT SCRIPT LOADED SUCCESSFULLY', window.location.href)

// window.addEventListener('spa:navigation', () => {
//   waitForElement('#target').then(doSomething)
// })
