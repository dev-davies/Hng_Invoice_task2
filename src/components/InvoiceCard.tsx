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
      className="block bg-white dark:bg-[#1E2139] shadow-sm rounded-lg p-6 mb-4 w-full border border-transparent hover:border-[#7C5DFA] transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300 md:grid md:grid-cols-5 md:items-center md:px-8 md:py-4"
    >
      {/* Top Row (ID & Client Name) */}
      <div className="flex justify-between items-center mb-6 md:mb-0 md:contents">
        <span className="font-bold text-[#0C0E16] dark:text-white md:col-span-1">
          <span className="text-[#7E88C3]">#</span>{invoice.id}
        </span>
        
        {/* Desktop: Column 2 (Due Date) */}
        <span className="hidden md:block text-[#858BB2] dark:text-[#DFE3FA] text-sm">
          Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>

        {/* Mobile: Top Right | Desktop: Column 3 */}
        <span className="text-[#858BB2] dark:text-[#DFE3FA] text-sm text-right truncate max-w-[50%] md:text-left md:max-w-none md:dark:text-white md:col-span-1">
          {invoice.clientName}
        </span>
      </div>

      {/* Bottom Row (Date, Amount & Status) */}
      <div className="flex justify-between items-center md:contents">
        {/* Left side (Date & Amount Stack) */}
        <div className="flex flex-col md:contents">
          {/* Mobile only date */}
          <span className="text-[#858BB2] dark:text-[#DFE3FA] text-sm mb-2 md:hidden">
            Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          
          {/* Total Amount (Visible on both, but col 4 on desktop) */}
          <span className="font-bold text-lg text-[#0C0E16] dark:text-white truncate max-w-[150px] md:text-xl md:text-right md:pr-10 md:max-w-none md:col-span-1">
            ₦{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>

        </div>

        {/* Right side (Status) */}
        <div className="flex items-center gap-4 md:col-span-1 md:justify-end">
          <StatusBadge status={invoice.status} />
          <svg className="hidden md:block" width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
        </div>
      </div>
    </Link>
  )
}

export default InvoiceCard
