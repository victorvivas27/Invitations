import { BrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import './styles.css'

export default function App() {
  return (
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  )
}
