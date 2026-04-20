import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InvoiceState, Invoice } from '../types'
import { dummyInvoices } from '../utils/data'


export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoices: dummyInvoices,
      theme: 'light',
      isFormOpen: false,
      invoiceToEdit: null,
      
      openForm: (invoice) => set({ isFormOpen: true, invoiceToEdit: invoice || null }),
      closeForm: () => set({ isFormOpen: false, invoiceToEdit: null }),

      addInvoice: (invoice: Invoice) => 
        set((state) => ({ invoices: [...state.invoices, invoice], isFormOpen: false })),

      
      updateInvoice: (id: string, updatedInvoice: Partial<Invoice>) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updatedInvoice } : inv
          ),
        })),
        
      deleteInvoice: (id: string) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),
        
      markAsPaid: (id: string) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: 'paid' } : inv
          ),
        })),
        
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'invoice-storage',
    }
  )
)
