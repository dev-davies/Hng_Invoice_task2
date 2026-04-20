interface StatusBadgeProps {
  status: 'paid' | 'pending' | 'draft'
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    paid: 'bg-green-500/10 text-green-500',
    pending: 'bg-orange-500/10 text-orange-500',
    draft: 'bg-gray-500/10 text-gray-500 dark:bg-gray-200/10 dark:text-gray-200',
  }

  const dotColors = {
    paid: 'bg-green-500',
    pending: 'bg-orange-500',
    draft: 'bg-gray-500 dark:bg-gray-200',
  }

  return (
    <div className={`px-4 py-3 rounded-md font-bold capitalize flex items-center justify-center gap-2 min-w-[104px] ${styles[status]}`}>
      <div className={`w-2 h-2 rounded-full ${dotColors[status]}`}></div>
      {status}
    </div>
  )
}

export default StatusBadge
