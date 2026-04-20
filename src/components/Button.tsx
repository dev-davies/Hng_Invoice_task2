import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-full font-bold transition-colors duration-200 flex items-center justify-center'
  
  const variants = {
    primary: 'bg-[#7C5DFA] hover:bg-[#9277FF] text-white',
    secondary: 'bg-[#F9FAFE] hover:bg-[#DFE3FA] text-[#7E88C3] dark:bg-[#252945] dark:hover:bg-white dark:text-[#DFE3FA] dark:hover:text-[#7E88C3]',
    danger: 'bg-[#EC5757] hover:bg-[#FF9797] text-white',
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
