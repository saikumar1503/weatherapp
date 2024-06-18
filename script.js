import ReactDOM from "react-dom/client";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Favourites from "./components/Favourites";
import WeatherDashboard from "./components/WeatherDashboard";
const root = ReactDOM.createRoot(document.getElementById("root"));
const approutes = createBrowserRouter([
  {
    path: "/",
    element: <WeatherDashboard />,
  },
  {
    path: "/favorities",
    element: <Favourites />,
  },
]);
root.render(<RouterProvider router={approutes}></RouterProvider>);
