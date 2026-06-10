import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Registro from "./pages/Registro";
import AreaPersonal from "./pages/AreaPersonal";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Registro /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "home", element: <Home /> },
          { path: "areapersonal", element: <AreaPersonal /> }
        ]
      },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default Router;