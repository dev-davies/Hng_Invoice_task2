import { useState } from 'react'
import { useInvoiceStore } from '../store/useInvoiceStore'
import InvoiceCard from '../components/InvoiceCard'
import Button from '../components/Button'

const HomeView = () => {
  const { invoices, openForm } = useInvoiceStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [activeFilters, setActiveFilters] = useState<string[]>(['draft', 'pending', 'paid'])

  const toggleFilter = (status: string) => {
    setActiveFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    )
  }

  const filteredInvoices = invoices.filter(inv => activeFilters.includes(inv.status))

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-16 max-sm:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Invoices</h1>
          <p className="text-[#888EB0] dark:text-[#DFE3FA] opacity-80">
            <span className="max-sm:hidden">There are </span>{filteredInvoices.length} total invoices
          </p>
        </div>

        <div className="flex items-center gap-4 lg:gap-10">
          {/* Dropdown Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 font-bold hover:opacity-70 transition-opacity"
            >
              Filter <span className="max-sm:hidden">by status</span>
              <svg className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.223 4.223L9.446 1" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            </button>

            {isFilterOpen && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[192px] bg-white dark:bg-[#252945] shadow-xl rounded-lg p-6 z-10 animate-in zoom-in-95 duration-200">
                {(['draft', 'pending', 'paid'] as const).map((status) => (
                  <label key={status} className="flex items-center gap-3 mb-4 last:mb-0 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeFilters.includes(status)} 
                      onChange={() => toggleFilter(status)}
                    />
                    <div className={`w-4 h-4 rounded-sm transition-colors flex items-center justify-center ${
                      activeFilters.includes(status) ? 'bg-[#7C5DFA]' : 'bg-[#DFE3FA] dark:bg-[#1E2139]'
                    } group-hover:border-[#7C5DFA] border border-transparent`}>
                      {activeFilters.includes(status) && (
                        <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 4.5l2.121 2.121 4.5-4.5" stroke="#FFF" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
                      )}
                    </div>
                    <span className="font-bold capitalize">{status}</span>
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
        <div className="flex flex-col items-center justify-center mt-20 lg:mt-32 text-center animate-in fade-in duration-700">
          <svg className="mb-10 w-[242px] h-[200px]" width="242" height="200" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M117.81 123.642l-47.072 27.178c-10.741 6.202-24.168 2.52-30.37-8.22L12.441 93.931c-6.202-10.741-2.52-24.168 8.221-30.37l47.072-27.177c10.741-6.202 24.168-2.52 30.37 8.22L126.03 93.274c6.202 10.742 2.52 24.168-8.22 30.368z" fill="#F4F4F4"/>
              <path d="M229.56 123.642l-47.073 27.178c-10.741 6.202-24.168 2.52-30.37-8.22l-27.927-48.669c-6.202-10.741-2.52-24.168 8.221-30.37l47.072-27.177c10.741-6.202 24.168-2.52 30.37 8.22l27.927 48.669c6.202 10.742 2.52 24.168-8.22 30.368z" fill="#F4F4F4"/>
              <path d="M84.148 43.123L57.26 27.545C61.433 13.916 75.397 5.093 90.72 5.093l60.559-.001c15.343 0 29.31 8.847 33.461 22.496l-26.888 15.534-.001 106.666c0 10.155-8.232 18.387-18.387 18.387l-35.918-.001c-10.156 0-18.388-8.232-18.388-18.387l-.01-106.666z" fill="#F4F4F4"/>
              <path d="M121 44h1v108h-1z" fill="#DFE3FA"/>
              <path d="M121 44h1v108h-1z" fill="#DFE3FA" transform="rotate(90 121.5 98)"/>
            </g>
          </svg>
          <h2 className="text-2xl font-bold mb-4">There is nothing here</h2>
          <p className="text-[#888EB0] dark:text-[#DFE3FA] max-w-[220px]">
            Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started
          </p>
        </div>
      )}
    </div>
  )
}

export default HomeView
