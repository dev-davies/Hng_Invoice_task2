import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInvoiceStore } from '../store/useInvoiceStore'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'

const InvoiceDetailView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, markAsPaid, deleteInvoice } = useInvoiceStore()
  
  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Invoice not found</h2>
        <Link to="/" className="text-[#7C5DFA] font-bold">Go back to home</Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Go Back */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-6 mb-8 font-bold hover:text-[#888EB0] transition-colors"
      >
        <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6.342.882L1.88 5.342l4.462 4.462" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
        Go back
      </button>

      {/* Status Bar */}
      <div className="bg-white dark:bg-[#1E2139] p-6 lg:px-8 rounded-lg shadow-sm flex items-center justify-between mb-6 transition-colors">
        <div className="flex items-center gap-4 max-sm:w-full max-sm:justify-between">
          <span className="text-[#858BB2] dark:text-[#DFE3FA] text-sm">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="flex items-center gap-2 max-sm:hidden">
          <Button variant="secondary">Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          {invoice.status === 'pending' && (
            <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>Mark as Paid</Button>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-[#1E2139] p-6 lg:p-12 rounded-lg shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-12 max-sm:flex-col max-sm:gap-8">
          <div>
            <h1 className="text-xl font-bold mb-2">
              <span className="text-[#888EB0]">#</span>{invoice.id}
            </h1>
            <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA]">{invoice.description}</p>
          </div>
          <div className="text-right max-sm:text-left text-sm text-[#888EB0] dark:text-[#DFE3FA]">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12 max-sm:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mb-3">Invoice Date</p>
              <p className="text-lg font-bold">{new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mb-3">Payment Due</p>
              <p className="text-lg font-bold">{new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mb-3">Bill To</p>
            <p className="text-lg font-bold mb-3">{invoice.clientName}</p>
            <div className="text-sm text-[#888EB0] dark:text-[#DFE3FA]">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="max-sm:col-span-2">
            <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mb-3">Sent to</p>
            <p className="text-lg font-bold break-all">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-8 max-sm:p-6 overflow-hidden transition-colors">
          <div className="grid grid-cols-4 gap-4 mb-8 text-sm text-[#888EB0] dark:text-[#DFE3FA] max-sm:hidden">
            <span className="col-span-2">Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          <div className="space-y-8">
            {invoice.items.map((item, index) => (
              <div key={index} className="grid lg:grid-cols-4 items-center gap-4">
                <div className="lg:col-span-2">
                  <p className="font-bold mb-2 lg:mb-0">{item.name}</p>
                  <p className="lg:hidden text-sm font-bold text-[#888EB0] dark:text-[#888EB0]">
                    {item.quantity} x £{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-center text-[#888EB0] dark:text-[#DFE3FA] font-bold max-lg:hidden">{item.quantity}</span>
                <span className="text-right text-[#888EB0] dark:text-[#DFE3FA] font-bold max-lg:hidden">£{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="text-right font-bold text-lg lg:text-base">£{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#373B53] dark:bg-[#0C0E16] p-8 lg:px-12 rounded-b-lg flex items-center justify-between text-white transition-colors">
          <span className="text-sm">Amount Due</span>
          <span className="text-2xl lg:text-3xl font-bold">£{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Mobile Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-[#1E2139] flex items-center justify-center gap-2 lg:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Button variant="secondary">Edit</Button>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        {invoice.status === 'pending' && (
          <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>Mark as Paid</Button>
        )}
      </div>
    </div>
  )
}

export default InvoiceDetailView
