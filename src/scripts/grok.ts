import { $, $$, getPrePrompt2 } from '@src/utils'

const textareaSelector = 'textarea'

export const grokCommands = [
  {
    command: 'Open new chat',
    action: () => {
      const newChatBtn = $$('a[href="/"]')[1] as HTMLAnchorElement
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
        'button[data-sidebar="trigger"]'
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
      const copyBtns = $$('button[type="button"] span[class*="code-block"]')

      const lastCopyBtn = copyBtns[copyBtns.length - 1] as HTMLButtonElement

      if (lastCopyBtn) {
        lastCopyBtn.click()
      } else {
        console.error('Last copy button not found!!')
      }
    },
  },
]
