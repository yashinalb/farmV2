import Home from "./pages/home/Home";
import Invoice from "./pages/invoice/Invoice";
import AddBuyer from "./pages/add-buyer/AddBuyer";
import AddProducts from "./pages/add-products/AddProducts";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import "./styles/global.scss";



function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
       {
        path:"/",
        element:<Layout />,
        children: [
          {
            path:"/",
            element:<Home />,
          },
          {
            path:"/add-buyer",
            element:<AddBuyer />,
          },
          {
            path:"/add-product",
            element:<AddProducts />,
          },
          {
            path:"/invoice",
            element:<Invoice />,
          }
        ]
       },
  ]);

  return <RouterProvider router={router} />;
}

export default App;