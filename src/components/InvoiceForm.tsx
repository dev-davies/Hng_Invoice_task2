import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect, useRef, useId } from 'react'
import type { InvoiceState } from '../types'

import { useInvoiceStore } from '../store/useInvoiceStore'
import { generateID } from '../utils/helpers'
import Button from './Button'

const InvoiceForm = () => {
  const { isFormOpen, closeForm, addInvoice, updateInvoice, invoiceToEdit } = useInvoiceStore() as InvoiceState
  const formRef = useRef<HTMLFormElement>(null)
  const baseId = useId()

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

  // Focus Trapping and ESC Key
  useEffect(() => {
    if (!isFormOpen) return

    const focusableElements = formRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeForm()
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeydown)
    firstElement?.focus()

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isFormOpen, closeForm])

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
    <div className="fixed inset-0 z-[100] flex" role="none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity animate-in fade-in duration-500" 
        onClick={closeForm}
        aria-hidden="true"
      />
      
      {/* Form Content */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit((data) => onSubmit(data, 'pending'))}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="relative w-full max-w-[720px] bg-white dark:bg-[#141625] h-full overflow-y-auto animate-in slide-in-from-left duration-500 rounded-r-[20px] p-14 max-sm:p-6 transition-colors shadow-2xl"
      >
        {/* Go Back (Mobile only) */}
        <button 
          type="button" 
          onClick={closeForm}
          className="hidden max-sm:flex items-center gap-6 font-bold text-sm mb-6 dark:text-white transition-colors"
        >
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#9277FF" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
          Go back
        </button>

        <h1 id="form-title" className="text-3xl font-bold mb-12 max-sm:mb-6 dark:text-white">
          {invoiceToEdit ? (
            <>Edit <span className="text-[#888EB0]">#</span>{invoiceToEdit.id}</>
          ) : 'New Invoice'}
        </h1>

        <div className="space-y-10">
          {/* Bill From */}
          <section aria-labelledby="bill-from-heading">
            <h3 id="bill-from-heading" className="text-[#7C5DFA] font-bold mb-6">Bill From</h3>
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-2 max-sm:gap-x-6 max-sm:gap-y-6">
              <div className="col-span-3">
                <label 
                  htmlFor={`${baseId}-sender-street`}
                  className="flex justify-between text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]"
                >
                  Street Address
                  {errors.senderAddress?.street && <span className="text-red-500 text-xs">can't be empty</span>}
                </label>
                <input 
                  id={`${baseId}-sender-street`}
                  {...register('senderAddress.street', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.street ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="max-sm:col-span-1">
                <label htmlFor={`${baseId}-sender-city`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">City</label>
                <input 
                  id={`${baseId}-sender-city`}
                  {...register('senderAddress.city', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.city ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="max-sm:col-span-1">
                <label htmlFor={`${baseId}-sender-postcode`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Post Code</label>
                <input 
                  id={`${baseId}-sender-postcode`}
                  {...register('senderAddress.postCode', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.postCode ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="col-span-1 max-sm:col-span-2">
                <label htmlFor={`${baseId}-sender-country`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Country</label>
                <input 
                  id={`${baseId}-sender-country`}
                  {...register('senderAddress.country', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.senderAddress?.country ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section aria-labelledby="bill-to-heading">
            <h3 id="bill-to-heading" className="text-[#7C5DFA] font-bold mb-6">Bill To</h3>
            <div className="space-y-6 mb-6">
              <div>
                <label htmlFor={`${baseId}-client-name`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Client's Name</label>
                <input 
                  id={`${baseId}-client-name`}
                  {...register('clientName', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientName ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-client-email`} className="flex justify-between text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">
                  Client's Email
                  {errors.clientEmail && <span className="text-red-500 text-xs">invalid format</span>}
                </label>
                <input 
                  id={`${baseId}-client-email`}
                  {...register('clientEmail', { 
                    required: true, 
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i 
                  })}
                  placeholder="e.g. email@example.com"
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientEmail ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-client-street`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Street Address</label>
                <input 
                  id={`${baseId}-client-street`}
                  {...register('clientAddress.street', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.street ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-2 max-sm:gap-x-6 max-sm:gap-y-6">
              <div className="max-sm:col-span-1">
                <label htmlFor={`${baseId}-client-city`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">City</label>
                <input 
                  id={`${baseId}-client-city`}
                  {...register('clientAddress.city', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.city ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="max-sm:col-span-1">
                <label htmlFor={`${baseId}-client-postcode`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Post Code</label>
                <input 
                  id={`${baseId}-client-postcode`}
                  {...register('clientAddress.postCode', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.postCode ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
              <div className="col-span-1 max-sm:col-span-2">
                <label htmlFor={`${baseId}-client-country`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Country</label>
                <input 
                  id={`${baseId}-client-country`}
                  {...register('clientAddress.country', { required: true })}
                  className={`w-full h-[56px] px-4 border rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none border-[#DFE3FA] focus:border-[#7C5DFA] transition-all dark:text-white ${errors.clientAddress?.country ? 'border-red-500 dark:border-red-500' : ''}`}
                />
              </div>
            </div>
          </section>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="max-sm:col-span-1">
              <label htmlFor={`${baseId}-created-at`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Invoice Date</label>
              <input 
                id={`${baseId}-created-at`}
                type="date"
                {...register('createdAt', { required: true })}
                className="w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white"
              />
            </div>
            <div className="max-sm:col-span-1">
              <label htmlFor={`${baseId}-payment-terms`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Payment Terms</label>
              <select 
                id={`${baseId}-payment-terms`}
                {...register('paymentTerms', { required: true })}
                className="w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white"
              >

                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Days</option>
                <option value="14">Net 14 Days</option>
                <option value="30">Net 30 Days</option>
              </select>
            </div>
            <div className="col-span-2 max-sm:col-span-1">
              <label htmlFor={`${baseId}-description`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">Project Description</label>
              <input 
                id={`${baseId}-description`}
                {...register('description', { required: true })}
                placeholder="e.g. Graphic Design Service"
                className={`w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
              />
            </div>
          </div>

          {/* Item List */}
          <section aria-labelledby="item-list-heading">
          {/* Item List Header (Desktop) */}
          <div className="grid grid-cols-[2.5fr_1fr_1.5fr_1fr_auto] gap-4 mb-4 max-sm:hidden">
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Item Name</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Qty.</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Price</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Total</span>
            <div className="w-4"></div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[2.5fr_1fr_1.5fr_1fr_auto] gap-4 items-end max-sm:grid-cols-4 max-sm:gap-4">
                <div className="max-sm:col-span-4">
                  <label htmlFor={`${baseId}-item-${index}-name`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA] lg:hidden">Item Name</label>
                  <input 
                    id={`${baseId}-item-${index}-name`}
                    {...register(`items.${index}.name` as const, { required: true })}
                    className={`w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.name ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                </div>
                <div className="max-sm:col-span-1">
                  <label htmlFor={`${baseId}-item-${index}-qty`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA] lg:hidden">Qty.</label>
                  <input 
                    id={`${baseId}-item-${index}-qty`}
                    type="number"
                    {...register(`items.${index}.quantity` as const, { required: true, min: 1 })}
                    className={`w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.quantity ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                </div>
                <div className="max-sm:col-span-1">
                  <label htmlFor={`${baseId}-item-${index}-price`} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA] lg:hidden">Price</label>
                  <input 
                    id={`${baseId}-item-${index}-price`}
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.price` as const, { required: true, min: 0.01 })}
                    className={`w-full h-[56px] px-4 border border-[#DFE3FA] rounded-md dark:bg-[#1E2139] dark:border-[#252945] font-bold outline-none focus:border-[#7C5DFA] transition-all dark:text-white ${errors.items?.[index]?.price ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                </div>
                <div className="max-sm:col-span-1">
                  <span className="block text-sm mb-4 text-[#7E88C3] dark:text-[#DFE3FA] lg:hidden">Total</span>
                  <div className="font-bold text-[#7E88C3] dark:text-[#DFE3FA] h-[56px] flex items-center">
                    {items[index]?.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="max-sm:col-span-1 flex justify-end h-[56px] items-center">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    aria-label={`Delete item ${index + 1}`}
                    className="p-3 text-[#888EB0] hover:text-[#EC5757] transition-colors"
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 2.667H13V1.333c0-.736-.597-1.333-1.333-1.333H1.333C.597 0 0 .597 0 1.333v1.334z" fill="currentColor"/>
                      <circle cx="6.5" cy="0.8" r="0.8" fill="currentColor"/>
                      <path d="M1.778 4.444v10.223c0 .736.597 1.333 1.333 1.333h7c.735 0 1.333-.597 1.333-1.333V4.444H1.778z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
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
        <footer className="mt-12 flex justify-between items-center bg-white dark:bg-[#141625] pt-8 sticky bottom-0 -mx-14 px-14 pb-8 z-10 transition-colors shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-none max-sm:-mx-6 max-sm:px-6">
          <Button variant="secondary" type="button" onClick={closeForm}>
            {invoiceToEdit ? 'Cancel' : 'Discard'}
          </Button>
          <div className="flex gap-2">
            {!invoiceToEdit && (
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => onSubmit(watch(), 'draft')}
                className="bg-[#373B53] text-[#888EB0] hover:bg-[#0C0E16] max-sm:px-4"
              >
                Save as Draft
              </Button>
            )}
            <Button variant="primary" type="submit" className="max-sm:px-4">
              {invoiceToEdit ? 'Save Changes' : 'Save & Send'}
            </Button>
          </div>
        </footer>

      </form>
    </div>
  )
}

export default InvoiceForm
