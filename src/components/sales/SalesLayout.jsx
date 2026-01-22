import SalesNav from './SalesNav'
import SalesGate from './SalesGate'

export default function SalesLayout({ children, title }) {
  return (
    <SalesGate>
      <div className="min-h-screen bg-gray-100">
        <SalesNav />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </SalesGate>
  )
}
