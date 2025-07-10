import { $, $$, getPrePrompt, getStoredProfile } from '@src/utils'

const textareaSelector = '#chat-input'

function isNewChat() {
  const path = window.location.pathname
  return path === '/' || path === '' || path.startsWith('/?')
}

export async function runDeepSeek() {
  if (!isNewChat()) {
    return
  }

  const textarea = $(textareaSelector) as HTMLTextAreaElement
  if (!textarea) return

  const profile = await getStoredProfile()

  if (!profile) {
    console.log('no profile found')
    return
  }

  const prePrompt = getPrePrompt(profile)

  if (!prePrompt) {
    return
  }

  textarea.addEventListener('input', () => {
    // is prePrompt injected or not
    if (textarea.value.startsWith(prePrompt)) {
      const userInput = textarea.value.slice(prePrompt.length).trim()
      if (userInput === '') {
        // User erased their part, only prePrompt remains
        textarea.value = ''
        return
      }
      return
    }

    // Inject prompt for the first time
    textarea.value = prePrompt + textarea.value
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

export const deepSeekCommands = [
  {
    command: 'Open new chat',
    action: () => {
      // there is 2 chat icons on the website. we select them by <path>
      const chatIcons = $$('svg  path[d^="M9.10999"]')
      const newMsgBtn = chatIcons[chatIcons.length - 1].closest('div')

      newMsgBtn?.click()
    },
  },
  {
    command: 'Toggle sidebar',
    action: () => {
      const sideBarOpenBtn = $(
        'path[d^="M23.7222 4H4.27776C3.57207 4 3 4.57207"]'
      )?.closest('div')

      // if sidebar is already open
      if (
        getComputedStyle(sideBarOpenBtn?.parentElement as HTMLElement)
          .display === 'none'
      ) {
        const sidebarCollapseBtn = $('.ds-icon-button') as HTMLElement
        sidebarCollapseBtn?.click()
      } else {
        sideBarOpenBtn?.click()
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
      const copyDownloadBtns = $$('.code-info-button-text')

      if (copyDownloadBtns.length >= 2) {
        const lastCodeBlockBtn = copyDownloadBtns[
          copyDownloadBtns.length - 2
        ] as HTMLElement
        lastCodeBlockBtn.click()
      }
    },
  },
]
