import { $, $$, getPrePrompt2 } from '@src/utils'

const textareaSelector = 'div[aria-label="Enter a prompt here"]'

function isNewChat(): boolean {
  const pathname = window.location.pathname.toLowerCase()
  return pathname === '/app'
}

export const geminiCommands = [
  {
    command: 'Open new chat',
    action: () => {
      const newChatBtn = $('button[aria-label="New chat"]') as HTMLButtonElement
      console.log({ newChatBtn })
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
        'button[aria-label="Main menu"]'
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
      const textarea = $(textareaSelector) as HTMLDivElement | null

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
      const copyBtns = $$('button[aria-label="Copy code"]')

      const lastCopyBtn = copyBtns[copyBtns.length - 1] as HTMLButtonElement

      if (lastCopyBtn) {
        lastCopyBtn.click()
      } else {
        console.error('Last copy button not found!!')
      }
    },
  },
]
