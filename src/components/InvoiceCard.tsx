import { Link } from 'react-router-dom'
import type { Invoice } from '../types'
import StatusBadge from './StatusBadge'

interface InvoiceCardProps {
  invoice: Invoice
}

const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
  return (
    <Link 
      to={`/invoice/${invoice.id}`}
      className="bg-white dark:bg-[#1E2139] p-6 md:px-8 md:py-4 rounded-lg shadow-sm border border-transparent hover:border-[#7C5DFA] transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Mobile Layout (Stacked Grid) */}
      <div className="grid grid-cols-2 md:hidden gap-4">
        <div className="space-y-4">
          <span className="font-bold text-[#0C0E16] dark:text-white text-sm">
            <span className="text-[#888EB0]">#</span>{invoice.id}
          </span>
          <div className="space-y-2">
            <span className="block text-xs text-[#888EB0] dark:text-[#DFE3FA]">
              Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="block text-base font-bold dark:text-white">
              £{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-end">
          <span className="text-xs text-[#858BB2] dark:text-white font-medium">
            {invoice.clientName}
          </span>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Tablet & Desktop Layout (Horizontal) */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <span className="w-16 font-bold text-[#0C0E16] dark:text-white">
          <span className="text-[#888EB0]">#</span>{invoice.id}
        </span>

        <span className="w-32 text-sm text-[#888EB0] dark:text-[#DFE3FA]">
          Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>

        <span className="flex-1 text-sm text-[#858BB2] dark:text-white">
          {invoice.clientName}
        </span>

        <span className="w-32 text-right text-lg font-bold dark:text-white">
          £{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>

        <div className="flex items-center gap-4 ml-8">
          <StatusBadge status={invoice.status} />
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
        </div>
      </div>
    </Link>
  )
}

export default InvoiceCard
