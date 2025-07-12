import { websites } from '@src/utils'
import { useEffect, useState } from 'react'

const disabledSite = ['Gemini', 'Grok'] // site already have custom instructions

export default function Settings() {
  const [enabledSites, setEnabledSites] = useState<Record<string, boolean>>({})

  useEffect(() => {
    chrome.storage.local.get(['enabledSites'], result => {
      if (result.enabledSites) {
        setEnabledSites(result.enabledSites)
      } else {
        const initialState = Object.fromEntries(
          websites.map(site => [site.name, !disabledSite.includes(site.name)])
        )
        setEnabledSites(initialState)
      }
    })
  }, [])

  const toggleSite = (site: string) => {
    const updated = {
      ...enabledSites,
      [site]: !enabledSites[site],
    }
    setEnabledSites(updated)
    chrome.storage.local.set({ enabledSites: updated })
  }

  return (
    <div>
      {websites.map(site => (
        <div key={site.name}>
          <label className="inline-flex items-center mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!enabledSites[site.name]}
              onChange={() => toggleSite(site.name)}
              className="sr-only peer"
              disabled={disabledSite.includes(site.name)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {site.name}

              {disabledSite.includes(site.name) && (
                <span className="text-xs ml-2 opacity-50">
                  site already have custom instructions !
                </span>
              )}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
