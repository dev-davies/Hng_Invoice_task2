import { useEffect } from 'react'
import { useInvoiceStore } from '../store/useInvoiceStore'

const Sidebar = () => {
  const { theme, toggleTheme } = useInvoiceStore()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[103px] bg-[#373B53] dark:bg-[#1E2139] flex flex-col justify-between items-center z-50 rounded-r-[20px] max-lg:w-full max-lg:h-[80px] max-lg:flex-row max-lg:rounded-none">
      {/* Logo Container */}
      <div className="relative w-full h-[103px] bg-[#7C5DFA] rounded-r-[20px] flex items-center justify-center overflow-hidden max-lg:w-[80px] max-lg:h-full">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#9277FF] rounded-tl-[20px]"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" className="relative z-10">
          <path fill="#FFF" fillRule="evenodd" d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"/>
        </svg>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center w-full max-lg:flex-row max-lg:w-auto max-lg:h-full">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="mb-8 max-lg:mb-0 max-lg:mr-8 hover:opacity-80 transition-opacity"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a.625.625 0 00-.625.625v1.25a.625.625 0 001.25 0v-1.25A.625.625 0 0010 0zm4.243 1.757a.625.625 0 00-.884.884l.884.884a.625.625 0 00.884-.884l-.884-.884zM18.125 9.375h-1.25a.625.625 0 000 1.25h1.25a.625.625 0 000-1.25zm-1.507 4.511a.625.625 0 00-.884.004l-.884.884 a.625.625 0 00.884.884l.884-.884a.625.625 0 00.004-.888zM10 18.125a.625.625 0 00-.625.625v1.25a.625.625 0 001.25 0v-1.25A.625.625 0 0010 18.125zm-4.243-1.757a.625.625 0 00-.884-.884l-.884-.884a.625.625 0 10-.884.884l.884.884zM1.875 10.625h1.25a.625.625 0 000-1.25h-1.25a.625.625 0 000 1.25zm1.507-4.511a.625.625 0 00.884-.004l.884-.884a.625.625 0 00-.884-.884l-.884.884a.625.625 0 00-.004.888zM10 5a5 5 0 100 10 5 5 0 000-10z" fill="#7E88C3" fillRule="nonzero"/></svg>
          ) : (
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M9.374.627a.625.625 0 00-.598.446 8.869 8.869 0 00-.183 3.186 8.89 8.89 0 001.38 4.23 8.877 8.877 0 002.81 2.81 8.89 8.89 0 004.23 1.38c.373.023.746.023 1.116 0 a.625.625 0 00.41-.989 7.505 7.505 0 01-5.18-8.062 7.505 7.505 0 01-3.987-2.201z" fill="#7E88C3" fillRule="nonzero"/></svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-[103px] lg:w-full lg:h-[1px] bg-[#494E6E] mb-0 lg:mb-0"></div>

        {/* Profile Image (Dummy) */}
        <div className="p-6">
          <img src="https://i.pravatar.cc/40?u=invoiceapp" alt="Avatar" className="w-[40px] h-[40px] rounded-full border-2 border-transparent hover:border-[#7C5DFA] transition-colors cursor-pointer" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
