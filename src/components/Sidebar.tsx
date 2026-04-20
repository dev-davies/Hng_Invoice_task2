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
          className="mb-8 max-lg:mb-0 max-lg:mr-8 hover:text-[#DFE3FA] transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="transition-all duration-500" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M13.746 9.347A4.724 4.724 0 0015.333 6 4.667 4.667 0 0010.667 1.333 4.667 4.667 0 006 6c0 1.276.511 2.43 1.334 3.27a4.59 4.59 0 00-1.454 3.351A4.667 4.667 0 0010.547 17a4.667 4.667 0 004.667-4.667 4.59 4.59 0 00-1.468-2.986zM10.667 16a3.333 3.333 0 01-3.334-3.333 3.333 3.333 0 013.334-3.334A3.333 3.333 0 0114 12.667 3.333 3.333 0 0110.667 16z" fill="#7E88C3" fillRule="nonzero"/></svg>
          ) : (
            <svg className="transition-all duration-500" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M9.819 19.181a9.202 9.202 0 01-9-9.19 9.202 9.202 0 019.19-9.19 9.202 9.202 0 019.191 9.19 9.202 9.202 0 01-9.381 9.19z" fill="#858BB2" fillRule="nonzero"/></svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-[103px] lg:w-full lg:h-[1px] bg-[#494E6E] mb-0 lg:mb-0"></div>

        {/* Profile Image (Dummy) */}
        <div className="p-6">
          <img src="https://i.pravatar.cc/40?u=invoiceapp" alt="Avatar" className="w-[40px] h-[40px] rounded-full border-2 border-transparent hover:border-[#7C5DFA] transition-all duration-300 cursor-pointer" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
