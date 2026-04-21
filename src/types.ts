export interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

export interface Item {
  name: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  status: 'draft' | 'pending' | 'paid'
  senderAddress: Address
  clientAddress: Address
  items: Item[]
  total: number
}

export type Theme = 'light' | 'dark'

export interface InvoiceState {
  invoices: Invoice[]
  theme: Theme
  isFormOpen: boolean
  invoiceToEdit: Invoice | null
  openForm: (invoice?: Invoice) => void
  closeForm: () => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updatedInvoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  markAsPending: (id: string) => void
  toggleTheme: () => void
}

