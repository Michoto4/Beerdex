import './App.css';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Recovery from './Components/Recovery/Recovery';

// import React react dom
import{
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

// create a router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/recovery',
    element: <Recovery/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/home',
    element: <Home/>
  }
]);

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
