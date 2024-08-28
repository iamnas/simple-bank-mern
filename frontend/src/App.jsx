import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"
import ProtectedRoute from "./pages/ProtectedRoute"

function App() {

  

  return (
    <>
      <BrowserRouter>
        <ProtectedRoute>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            {/* <Route path="/*" element={<ProtectedRoute />} /> */}
          </Routes>
          </ProtectedRoute>
      </BrowserRouter>
    </>
  )
}

export default App
