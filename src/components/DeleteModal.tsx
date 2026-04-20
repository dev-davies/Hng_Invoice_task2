import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import Button from './Button'

interface DeleteModalProps {
  invoiceId: string
  onConfirm: () => void
  onCancel: () => void
}

const DeleteModal: FC<DeleteModalProps> = ({ invoiceId, onConfirm, onCancel }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus management: Trap focus inside modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    // Focus the first button on mount
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleTabKey)
    window.addEventListener('keydown', handleEscKey)

    return () => {
      window.removeEventListener('keydown', handleTabKey)
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="relative bg-white dark:bg-[#1E2139] p-8 lg:p-12 max-w-[480px] w-full rounded-lg shadow-2xl transition-colors animate-in zoom-in-95 duration-200"
      >
        <h2 id="delete-modal-title" className="text-2xl font-bold mb-4 dark:text-white">Confirm Deletion</h2>
        <p className="text-[#888EB0] dark:text-[#DFE3FA] leading-relaxed mb-6 font-medium">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
