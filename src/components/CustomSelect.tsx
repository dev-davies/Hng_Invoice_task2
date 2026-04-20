import { useState, useRef, useEffect } from 'react'

interface Option {
  label: string
  value: string | number
}

interface CustomSelectProps {
  label: string
  options: Option[]
  value: string | number
  onChange: (value: string | number) => void
  id?: string
}

const CustomSelect = ({ label, options, value, onChange, id }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const selectedOption = options.find(opt => opt.value === value)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val: string | number) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={id} className="block text-sm mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">
        {label}
      </label>
      
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[56px] px-4 flex items-center justify-between border rounded-md bg-white dark:bg-[#1E2139] font-bold text-sm transition-all outline-none 
          ${isOpen ? 'border-[#7C5DFA]' : 'border-[#DFE3FA] dark:border-[#252945]'} 
          dark:text-white hover:border-[#7C5DFA]`}
      >
        <span>{selectedOption?.label}</span>
        <svg 
          width="11" 
          height="7" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[90px] left-0 w-full bg-white dark:bg-[#252945] shadow-[0_10px_20px_rgba(72,84,159,0.25)] rounded-lg z-50 overflow-hidden divide-y divide-[#DFE3FA] dark:divide-[#1E2139]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-6 py-4 text-left text-sm font-bold transition-colors 
                ${option.value === value ? 'text-[#7C5DFA]' : 'text-[#0C0E16] dark:text-[#DFE3FA]'} 
                hover:text-[#7C5DFA]`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
