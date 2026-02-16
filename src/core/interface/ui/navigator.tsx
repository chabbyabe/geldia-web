import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

export const Navigator = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}