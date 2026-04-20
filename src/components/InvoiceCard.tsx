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
      className="bg-white dark:bg-[#1E2139] p-6 lg:px-8 lg:py-4 rounded-lg shadow-sm border border-transparent hover:border-[#7C5DFA] transition-all flex items-center justify-between cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
        <span className="font-bold text-[#0C0E16] dark:text-white">
          <span className="text-[#888EB0]">#</span>{invoice.id}
        </span>
        <span className="text-sm text-[#888EB0] dark:text-[#DFE3FA] max-lg:row-start-2">
          Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="text-sm text-[#858BB2] dark:text-white max-lg:text-right">
          {invoice.clientName}
        </span>
        <span className="text-xl font-bold max-lg:row-start-2 text-right lg:text-left">
          £{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="flex items-center gap-4 ml-8">
        <StatusBadge status={invoice.status} />
        <svg className="max-lg:hidden" width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
      </div>
    </Link>
  )
}


export default InvoiceCard
