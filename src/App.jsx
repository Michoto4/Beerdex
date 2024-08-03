import './App.css'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Recovery from './Components/Recovery/Recovery'

// import React react dom
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

// create a router
const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login/></div>
  },
  {
    path: '/register',
    element: <div><Register/></div>
  },
  {
    path: '/home',
    element: <div><Home/></div>
  },
  {
    path: '/recovery',
    element: <div><Recovery/></div>
  }
])

function App() {

  return (
    <>
      <div>
        <RouterProvider router={router}/>
      </div>
    </>
  )
}

export default App
