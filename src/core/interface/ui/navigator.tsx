import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { LoginContainer } from '@screens/login/login.container'
import { SignupContainer } from '@screens/signup/signup.container'

export const Navigator = () => {
  const PrivateRoute: React.FC<{ element: any }> = (props) => {
    return props.element;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivateRoute element={<LoginContainer />} />} />
        <Route path='/signup' element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}