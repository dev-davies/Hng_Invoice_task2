import { useEffect } from 'react'
import { useInvoiceStore } from '../store/useInvoiceStore'
import Logo from '../assets/logo.svg'

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
      <div className="relative w-full h-[103px] bg-[#7C5DFA] rounded-r-[20px] overflow-hidden max-lg:w-[80px] max-lg:h-full cursor-pointer hover:opacity-90 transition-opacity">
        <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
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
            /* Crescent Moon for switching to Dark Mode */
            <svg className="transition-all duration-500 hover:fill-[#DFE3FA]" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.502 11.342a.703.703 0 00-.588.128 7.499 7.499 0 01-11.45-6.386.701.701 0 00-.738-.725 9.195 9.195 0 00-1.126 14.82 9.195 9.195 0 0013.903-7.14.703.703 0 00-.001-.697z" fill="#7E88C3" fillRule="nonzero"/>
            </svg>
          ) : (
            /* Small Circle Sun for switching to Light Mode */
            <svg className="transition-all duration-500 hover:fill-[#DFE3FA]" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" fill="#858BB2" />
              <path d="M10 0v2.5M10 17.5V20M20 10h-2.5M2.5 10H0M17.071 2.929l-1.768 1.768M4.697 15.303l-1.768 1.768M17.071 17.071l-1.768-1.768M4.697 4.697L2.929 2.929" stroke="#858BB2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

        </button>

        {/* Divider */}
        <div className="w-[1px] h-full lg:w-full lg:h-[1px] bg-[#494E6E]"></div>


        {/* Profile Image (Dummy) */}
        <div className="p-6">
          <img src="https://i.pravatar.cc/40?u=invoiceapp" alt="Avatar" className="w-[40px] h-[40px] rounded-full border-2 border-transparent hover:border-[#7C5DFA] transition-all duration-300 cursor-pointer" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
