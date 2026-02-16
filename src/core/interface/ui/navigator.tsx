import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { SignupContainer } from '@screens/signup/signup.container'

export const Navigator = () => {
  const PrivateRoute: React.FC<{ element: any }> = (props) => {
    return props.element;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}