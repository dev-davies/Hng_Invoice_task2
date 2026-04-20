import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomeView from './pages/HomeView'
import InvoiceDetailView from './pages/InvoiceDetailView'
import InvoiceForm from './components/InvoiceForm'

function App() {
  return (
    <Router>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F8FB] dark:bg-[#141625] text-[#0C0E16] dark:text-[#DFE3FA] transition-colors duration-300 font-sans overflow-x-hidden">
        <Sidebar />
        <InvoiceForm />
        
        <main className="flex-1 p-8 lg:p-20 lg:ml-[103px] max-lg:mt-[80px]">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/invoice/:id" element={<InvoiceDetailView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
