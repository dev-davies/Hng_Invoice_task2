import { useState, useRef, useEffect } from 'react'

interface CustomDatePickerProps {
  label: string
  value: string // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void
  id?: string
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const CustomDatePicker = ({ label, value, onChange, id }: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Internal state for the calendar view (might be different from the selected value)
  const [viewDate, setViewDate] = useState(new Date(value || new Date()))
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const generateDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const days = []
    const totalDays = daysInMonth(year, month)
    const prevMonthDays = daysInMonth(year, month - 1)
    const startDay = startDayOfMonth(year, month)

    // Pad from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true })
    }

    // Pad from next month
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false })
    }

    return days
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    // Offset for local time to ensure ISO string doesn't jump a day
    const offset = newDate.getTimezoneOffset()
    const localDate = new Date(newDate.getTime() - (offset * 60 * 1000))
    onChange(localDate.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const changeMonth = (offset: number) => {
    const newViewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)
    setViewDate(newViewDate)
  }

  const isSelected = (day: number) => {
    if (!value) return false
    const d = new Date(value)
    return d.getDate() === day && 
           d.getMonth() === viewDate.getMonth() && 
           d.getFullYear() === viewDate.getFullYear()
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
        <span>{formatDateDisplay(value)}</span>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H12V0H10V2H6V0H4V2H2C0.89 2 0.01 2.89 0.01 4L0 14C0 15.11 0.89 16 2 16H14C15.11 16 16 15.11 16 14V4C16 2.89 15.11 2 14 2ZM14 14H2V7H14V14Z" fill="#7E88C3"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[90px] left-0 w-[240px] bg-white dark:bg-[#252945] shadow-[0_10px_20px_rgba(72,84,159,0.25)] rounded-lg z-50 p-6 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:opacity-60 transition-opacity">
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            </button>
            <span className="font-bold text-sm dark:text-white">
              {fullMonths[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:opacity-60 transition-opacity">
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.228 4.228L1 9.456" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-4 justify-items-center">
            {generateDays().map((dateInfo, i) => (
              <button
                key={i}
                type="button"
                disabled={!dateInfo.currentMonth}
                onClick={() => handleDateSelect(dateInfo.day)}
                className={`w-4 h-4 flex items-center justify-center text-xs font-bold transition-colors
                  ${!dateInfo.currentMonth ? 'opacity-10' : 'hover:text-[#7C5DFA] dark:text-white'} 
                  ${dateInfo.currentMonth && isSelected(dateInfo.day) ? 'text-[#7C5DFA]' : ''}`}
              >
                {dateInfo.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDatePicker
