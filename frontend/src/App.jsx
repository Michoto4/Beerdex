import "./App.scss";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Recovery from "./Components/Recovery/Recovery";
import Reset from "./Components/Reset/Reset";
import Intersection from "./Components/Intersection";
import RecoveryOTP from "./Components/Recovery/RecoveryOTP";

// import React react dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// create a router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Intersection />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/recovery",
    element: <Recovery />,
  },
  {
    path: "/recoveryOTP",
    element: <RecoveryOTP />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
]);

function App() {
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
