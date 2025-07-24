// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "./App";
import AllPerfumes from "./pages/AllPerfumes";
import Home from "./pages/Home";
import Perfume from "./pages/Perfume";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/parfums",
        element: <AllPerfumes />,
      },
      {
        path: "/parfum/:id",
        element: <Perfume />,
      },
    ],
  },
]);
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
