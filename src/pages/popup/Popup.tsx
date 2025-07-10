import { useState, useEffect, useRef, useCallback } from 'react'

type StorageArea = 'local' | 'sync'
type SetValue<T> = React.Dispatch<React.SetStateAction<T>>

import React from 'react'
import { CustomInstructions } from './components/custom-instructions'
import { KeyboardShortcuts } from './components/keyboard-shortcuts'
import Settings from './components/settings'

export default function Popup() {
  const [activeTab, setActiveTab] = useState('Custom instructions')
  const tabs = ['Custom instructions', 'Shortcuts', 'Settings']

  return (
    <div className="p-4 dark:bg-gray-900 antialiased h-full">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-6">
        {tabs.map(tab => (
          <li key={tab} className="me-2">
            <a
              href="#"
              className={`inline-block p-4 rounded-t-lg ${
                tab === activeTab
                  ? 'text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
              onClick={e => {
                e.preventDefault()
                setActiveTab(tab)
              }}
              aria-current={tab === activeTab ? 'page' : undefined}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>

      {activeTab === 'Shortcuts' && <KeyboardShortcuts />}
      {activeTab === 'Custom instructions' && <CustomInstructions />}
      {activeTab === 'Settings' && <Settings />}
      {/* <CustomInstructions /> */}
    </div>
  )
}
