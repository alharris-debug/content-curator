import { Routes, Route } from 'react-router-dom'

function Placeholder({ name }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Dashboard" />} />
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/clients/new" element={<Placeholder name="Add Client" />} />
      <Route path="/clients/:id" element={<Placeholder name="Edit Client" />} />
      <Route path="/generate" element={<Placeholder name="Generate Posts" />} />
      <Route path="/history" element={<Placeholder name="History" />} />
      <Route path="/settings" element={<Placeholder name="Settings" />} />
    </Routes>
  )
}

export default App
