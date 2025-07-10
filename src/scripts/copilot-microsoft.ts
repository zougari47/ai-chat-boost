import { Profile } from '@src/types'
import { $, $$, getPrePrompt, getPrePrompt2 } from '@src/utils'

const textareaSelector = '#userInput'

function waitForElement(selector: string): Promise<Element> {
  return new Promise(resolve => {
    const el = $(selector)

    if (el) {
      resolve(el)
      return
    }

    const observer = new MutationObserver(() => {
      const el = $(selector)

      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

async function isNewChat(): Promise<boolean> {
  const element = await Promise.race([
    waitForElement('[data-testid="launch-greeting"]'),
    waitForElement('[data-content="user-message"]'),
  ])

  const isNewChat =
    element.hasAttribute('data-testid') &&
    element.getAttribute('data-testid') === 'launch-greeting'

  return isNewChat
}

export async function runCopilotMicrosoft() {
  const _isNewChat = await isNewChat()

  // exit if not a new chat
  if (!_isNewChat) {
    return
  }

  const textarea = $(textareaSelector) as HTMLTextAreaElement
  if (!textarea) return

  const prePrompt = await getPrePrompt2()

  if (prePrompt === '') return

  async function onInput() {
    const isOldChat = !(await isNewChat())
    if (isOldChat) {
      textarea.removeEventListener('input', onInput)
      return
    }

    if (textarea.value.startsWith(prePrompt)) {
      const userInput = textarea.value.slice(prePrompt.length).trim()
      if (userInput === '') {
        textarea.value = ''
        return
      }
      return
    }

    textarea.value = prePrompt + textarea.value
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }

  textarea.addEventListener('input', onInput)
}

export const copilotMicrosoftCommands = [
  {
    command: 'Open new chat',
    action: () => {
      const newChatBtn = $(
        "button[title='Start new chat']"
      ) as HTMLButtonElement
      if (newChatBtn) {
        newChatBtn.click()
      } else {
        console.error('New chat button not found!!')
      }
    },
  },
  {
    command: 'Toggle sidebar',
    action: () => {
      const sideBarToggleBtn = $(
        'button[data-testid="sidebar-toggle-button"]'
      ) as HTMLButtonElement
      if (sideBarToggleBtn) {
        sideBarToggleBtn.click()
      } else {
        console.error('Sidebar toggle button not found!!')
      }
    },
  },
  {
    command: 'Focus chat input',
    action: () => {
      const textarea = $(textareaSelector) as HTMLTextAreaElement | null

      if (textarea) {
        textarea.focus()
      } else {
        console.error('Chat input not found!!')
      }
    },
  },
  {
    command: 'Copy last code block',
    action: () => {
      const copyBtns = $$('button[title="Copy code"]')

      const lastCopyBtn = copyBtns[copyBtns.length - 1] as HTMLButtonElement

      if (lastCopyBtn) {
        lastCopyBtn.click()
      } else {
        console.error('Last copy button not found!!')
      }
    },
  },
]
