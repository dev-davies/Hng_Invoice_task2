/**
 * Generates a random 6-character ID for invoices (e.g., #RT3080).
 * Format: 2 uppercase letters + 4 digits.
 */
export const generateID = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  let result = ''
  
  // 2 letters
  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  
  // 4 numbers
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  
  return result
}
