import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import type { InvoiceState } from '../types'

import { useInvoiceStore } from '../store/useInvoiceStore'
import { generateID } from '../utils/helpers'
import Button from './Button'

const InvoiceForm = () => {
  const { isFormOpen, closeForm, addInvoice, updateInvoice, invoiceToEdit } = useInvoiceStore() as InvoiceState

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      senderAddress: { street: '', city: '', postCode: '', country: '' },
      clientName: '',
      clientEmail: '',
      clientAddress: { street: '', city: '', postCode: '', country: '' },
      createdAt: new Date().toISOString().split('T')[0],
      paymentTerms: 30,
      description: '',
      items: [{ name: '', quantity: 1, price: 0, total: 0 }],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const items = watch("items") || []

  // Update item total when qty or price changes
  useEffect(() => {
    items.forEach((item, index) => {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const total = quantity * price
      if (total !== item.total) {
        setValue(`items.${index}.total` as any, total)
      }
    })
  }, [items, setValue])

  useEffect(() => {
    if (invoiceToEdit) {
      reset(invoiceToEdit)
    } else {
      reset({
        senderAddress: { street: '', city: '', postCode: '', country: '' },
        clientName: '',
        clientEmail: '',
        clientAddress: { street: '', city: '', postCode: '', country: '' },
        createdAt: new Date().toISOString().split('T')[0],
        paymentTerms: 30,
        description: '',
        items: [{ name: '', quantity: 1, price: 0, total: 0 }],
      })
    }
  }, [invoiceToEdit, reset, isFormOpen])

  if (!isFormOpen) return null

  const onSubmit = (data: any, status: 'pending' | 'draft') => {
    const total = data.items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0)
    const invoiceData = {
      ...data,
      id: invoiceToEdit?.id || generateID(),
      status,
      total,
      paymentDue: calculatePaymentDue(data.createdAt, data.paymentTerms),
    }

    if (invoiceToEdit) {
      updateInvoice(invoiceToEdit.id, invoiceData)
    } else {
      addInvoice(invoiceData)
    }
    closeForm()
  }

  const calculatePaymentDue = (dateStr: string, terms: number) => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + Number(terms))
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity animate-in fade-in duration-500" 
        onClick={closeForm}
      />
      
      {/* Form Content */}
      <form 
        onSubmit={handleSubmit((data) => onSubmit(data, 'pending'))}
        className="relative w-full max-w-[720px] bg-white dark:bg-[#141625] h-full overflow-y-auto animate-in slide-in-from-left duration-500 rounded-r-[20px] p-14 max-sm:p-6 transition-colors shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-12 dark:text-white">
          {invoiceToEdit ? (
            <>Edit <span className="text-[#888EB0]">#</span>{invoiceToEdit.id}</>
          ) : 'New Invoice'}
        </h1>

        <div className="space-y-10">
          {/* Bill From */}
          <section>
            <h3 className="text-[#7C5DFA] font-bold mb-6">Bill From</h3>
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-2">
              <div className="col-span-3">
                <label className="flex justify-between text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">
                  Street Address
                  {errors.senderAddress?.street && <span className="text-red-500 text-xs">can't be empty</span>}
                </label>
                <input 
                  {...register('senderAddress.street', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.street ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">City</label>
                <input 
                  {...register('senderAddress.city', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.city ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Post Code</label>
                <input 
                  {...register('senderAddress.postCode', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.postCode ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="max-sm:col-span-2">
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Country</label>
                <input 
                  {...register('senderAddress.country', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.country ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section>
            <h3 className="text-[#7C5DFA] font-bold mb-6">Bill To</h3>
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Client's Name</label>
                <input 
                  {...register('clientName', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientName ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="flex justify-between text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">
                  Client's Email
                  {errors.clientEmail && <span className="text-red-500 text-xs">invalid format</span>}
                </label>
                <input 
                  {...register('clientEmail', { 
                    required: true, 
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i 
                  })}
                  placeholder="e.g. email@example.com"
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientEmail ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Street Address</label>
                <input 
                  {...register('clientAddress.street', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.street ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-2">
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">City</label>
                <input 
                  {...register('clientAddress.city', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.city ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Post Code</label>
                <input 
                  {...register('clientAddress.postCode', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.postCode ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="max-sm:col-span-2">
                <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Country</label>
                <input 
                  {...register('clientAddress.country', { required: true })}
                  className={`w-full p-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.country ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
          </section>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Invoice Date</label>
              <input 
                type="date"
                {...register('createdAt', { required: true })}
                className="w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Payment Terms</label>
              <select 
                {...register('paymentTerms', { required: true })}
                className="w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white"
              >
                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Days</option>
                <option value="14">Net 14 Days</option>
                <option value="30">Net 30 Days</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Project Description</label>
              <input 
                {...register('description', { required: true })}
                placeholder="e.g. Graphic Design Service"
                className={`w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
              />
            </div>
          </div>

          {/* Item List */}
          <section>
            <h3 className="text-xl text-[#777F98] font-bold mb-4">Item List</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[2.5fr_1fr_1.5fr_1fr_auto] gap-4 items-end max-sm:grid-cols-2 max-sm:gap-2">
                  <div className="max-sm:col-span-2">
                    <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA] lg:hidden">Item Name</label>
                    <input 
                      {...register(`items.${index}.name` as const, { required: true })}
                      className={`w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.name ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Qty.</label>
                    <input 
                      type="number"
                      {...register(`items.${index}.quantity` as const, { required: true, min: 1 })}
                      className={`w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.quantity ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Price</label>
                    <input 
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.price` as const, { required: true, min: 0.01 })}
                      className={`w-full p-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.price ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Total</label>
                    <div className="p-4 font-bold text-[#7E88C3] dark:text-[#DFE3FA]">
                      {items[index]?.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-4 text-[#7E88C3] hover:text-[#EC5757] transition-colors"
                  >
                    <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H3.194a1.777 1.777 0 01-1.777-1.778V3.556h10.166zM9.25 0a.889.889 0 01.889.889v1.778H2.861V.889A.889.889 0 013.75 0h5.5z" fill="currentColor" fillRule="nonzero"/></svg>
                  </button>
                </div>
              ))}
            </div>
            
            <Button 
              type="button"
              variant="secondary" 
              className="w-full mt-4" 
              onClick={() => append({ name: '', quantity: 1, price: 0, total: 0 })}
            >
              + Add New Item
            </Button>
            {errors.items && <p className="text-red-500 text-xs mt-2 text-right">An item must be added and all fields filled.</p>}
          </section>
        </div>

        {/* Footer Actions */}
        <footer className="mt-12 flex justify-between items-center bg-white dark:bg-[#141625] pt-8 sticky bottom-0 -mx-14 px-14 pb-8 z-10 transition-colors">
          <Button variant="secondary" type="button" onClick={closeForm}>
            {invoiceToEdit ? 'Cancel' : 'Discard'}
          </Button>
          <div className="flex gap-2">
            {!invoiceToEdit && (
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => onSubmit(watch(), 'draft')}
                className="bg-[#373B53] text-[#888EB0] hover:bg-[#0C0E16]"
              >
                Save as Draft
              </Button>
            )}
            <Button variant="primary" type="submit">
              {invoiceToEdit ? 'Save Changes' : 'Save & Send'}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  )
}

export default InvoiceForm
