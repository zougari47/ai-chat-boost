import { useState, useEffect, useRef, useCallback } from 'react'

type StorageArea = 'local' | 'sync'
type SetValue<T> = React.Dispatch<React.SetStateAction<T>>

export function useStorage<T>(
  key: string,
  initialValue: T,
  area: StorageArea = 'local'
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    chrome.storage[area].get(key).then(result => {
      if (result[key] !== undefined) {
        setStoredValue(result[key])
      }
    })
  }, [key, area])

  const storedValueRef = useRef(storedValue)
  storedValueRef.current = storedValue

  const setValue = useCallback(
    (value: React.SetStateAction<T>) => {
      const valueToStore =
        value instanceof Function ? value(storedValueRef.current) : value
      setStoredValue(valueToStore)
      chrome.storage[area].set({ [key]: valueToStore }).catch(console.error)
    },
    [key, area]
  )

  return [storedValue, setValue]
}

import React from 'react'

type Profile = {
  name: string
  job: string
  traits: string
  extra: string
}

export function CustomInstructions() {
  const [form, setForm] = useState<Profile>({
    name: '',
    job: '',
    traits: '',
    extra: '',
  })
  const [saved, setSaved] = useState(false)

  // Load saved data on mount
  useEffect(() => {
    chrome.storage.local.get(['aiProfile'], result => {
      if (result.aiProfile) {
        setForm(result.aiProfile)
      }
    })
  }, [])

  // Handle input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }

  // Save to storage
  function handleSave(e: React.MouseEvent<HTMLButtonElement>) {
    chrome.storage.local.set({ aiProfile: form }, () => {
      console.log('Saved', form)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 3000)
      // You can add user feedback here (toast, alert, etc)
    })

    e.currentTarget.blur()
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          What should AI call you ?
        </label>
        <input
          type="text"
          id="name"
          value={form.name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="John"
          required
        />
      </div>

      <div>
        <label
          htmlFor="job"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          What you do ?
        </label>
        <input
          type="text"
          id="job"
          value={form.job}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Developer"
          required
        />
      </div>

      <div>
        <label
          htmlFor="traits"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          What traits should AI have?
        </label>
        <textarea
          id="traits"
          rows={4}
          value={form.traits}
          onChange={handleChange}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg 
            border border-gray-300 focus:ring-blue-500 focus:border-blue-500 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        />
      </div>

      <div>
        <label
          htmlFor="extra"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Anything else AI should know about you?
        </label>
        <textarea
          id="extra"
          rows={4}
          value={form.extra}
          onChange={handleChange}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg 
            border border-gray-300 focus:ring-blue-500 focus:border-blue-500 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleSave}
          className="w-full cursor-pointer text-white bg-blue-700 hover:bg-blue-800 
            focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 
            me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>

        <div
          className={`p-2 mb-4 flex gap-2 items-center text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 
              transition-opacity duration-500 ease-in-out
              ${
                saved
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }
              `}
          role="alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="font-semibold text-sm">
            Change saved successfully
          </span>
        </div>
      </div>
    </div>
  )
}
