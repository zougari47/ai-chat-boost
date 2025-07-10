export function KeyboardShortcuts() {
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
      keybinding: 'shift + esc',
    },
    {
      command: 'Copy last code block',
      keybinding: 'ctrl + shift + :',
    },
  ]
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Command
            </th>
            <th scope="col" className="px-6 py-3">
              Keybinding
            </th>
          </tr>
        </thead>
        <tbody>
          {commands.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item.command}
              </th>
              <td className="px-6 py-4">{item.keybinding}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
