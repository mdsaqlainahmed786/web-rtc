import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Sender from './Components/sender'
import Receiver from './Components/receiver'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender />} />
        <Route path="/receiver" element={ <Receiver/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
