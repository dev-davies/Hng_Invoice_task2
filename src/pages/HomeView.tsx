import { useState, useRef, useEffect } from 'react'
import { useInvoiceStore } from '../store/useInvoiceStore'
import InvoiceCard from '../components/InvoiceCard'
import Button from '../components/Button'


const HomeView = () => {
  const { invoices, openForm } = useInvoiceStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>(['draft', 'pending', 'paid'])
  const filterRef = useRef<HTMLDivElement>(null)

  const toggleFilter = (status: string) => {
    setActiveFilters(prev => 
      prev.includes(status) 
        ? prev.filter(f => f !== status)
        : [...prev, status]
    )
  }

  // Handle click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFilterOpen(false)
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isFilterOpen])

  const filteredInvoices = invoices.filter(invoice => 
    activeFilters.includes(invoice.status)
  )

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-16 max-sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl mb-2 dark:text-white transition-colors">Invoices</h1>
          <p className="text-[#888EB0] dark:text-[#DFE3FA] text-sm transition-colors">
            <span className="max-sm:hidden">There are </span>
            {filteredInvoices.length} 
            <span className="max-sm:hidden"> total</span> invoices
          </p>
        </div>

        <div className="flex items-center gap-10 max-sm:gap-4">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-haspopup="listbox"
              aria-expanded={isFilterOpen}
              className="flex items-center gap-4 font-bold hover:text-[#888EB0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C5DFA] rounded-md px-2 py-1"
            >
              Filter <span className="max-sm:hidden">by status</span>
              <svg 
                className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} 
                width="11" height="7" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/>
              </svg>
            </button>

            {isFilterOpen && (
              <div 
                role="listbox"
                className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-[#1E2139] p-6 rounded-lg shadow-xl z-20 flex flex-col gap-4 animate-in zoom-in-95 duration-200 transition-colors"
              >
                {['draft', 'pending', 'paid'].map((status) => (
                  <label 
                    key={status} 
                    className="flex items-center gap-3 cursor-pointer group hover:text-[#7C5DFA] transition-colors"
                  >
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={activeFilters.includes(status)}
                        onChange={() => toggleFilter(status)}
                        className="peer appearance-none w-4 h-4 bg-[#DFE3FA] dark:bg-[#1E2139] rounded border border-transparent checked:bg-[#7C5DFA] hover:border-[#7C5DFA] cursor-pointer transition-all focus:ring-2 focus:ring-[#7C5DFA] focus:ring-offset-2 dark:focus:ring-offset-[#1E2139]"
                      />
                      <svg className="absolute w-3 h-3 text-white hidden peer-checked:block left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="capitalize font-bold text-sm dark:text-white transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Button variant="primary" className="gap-4 pl-2 pr-6 py-2" onClick={() => openForm()}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.313 10.031V6.313h3.718V4.687H6.313V.969H4.687v3.718H.969v1.626h3.718v3.718z" fill="#7C5DFA" fillRule="nonzero"/></svg>
            </div>
            New <span className="max-sm:hidden">Invoice</span>
          </Button>
        </div>
      </header>

      {filteredInvoices.length > 0 ? (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
          <svg className="mb-10" width="242" height="200" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M220.016 112.593c-2.433-21.734-19.349-38.995-40.016-41.13a48.067 48.067 0 00-41.51-24.032c-20.73 0-38.6 13.064-45.316 31.393-2.316-.364-4.66-.543-7.004-.543-25.56 0-46.16 20.301-46.16 45.495 0 .285.002.57.007.854C16.892 130.638 0 152.052 0 177.103c0 1.298.046 2.595.137 3.89h241.727c.09-1.295.136-2.592.136-3.89 0-29.3-22.39-44.51-31.984-64.51z" fill="#F9FAFE" />
              <path d="M121 0l11 31H110l11-31z" fill="#7C5DFA" opacity=".247" />
              <path d="M194 40l5 14h-10l5-14zM47 50l4 10h-8l4-10z" fill="#7C5DFA" opacity=".103" />
            </g>
          </svg>
          <h2 className="text-2xl font-bold mb-4 dark:text-white transition-colors">There is nothing here</h2>
          <p className="text-[#888EB0] dark:text-[#DFE3FA] max-w-[220px] transition-colors">
            Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started
          </p>
        </div>
      )}
    </div>
  )
}

export default HomeView
