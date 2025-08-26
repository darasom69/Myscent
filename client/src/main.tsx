// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "./App";
import AllPerfumes from "./pages/AllPerfumes";
import Brand from "./pages/Brand";
import Home from "./pages/Home";
import Perfume from "./pages/Perfume";
import Quizz from "./pages/Quizz";
import UserAccount from "./pages/UserAccount";

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
      {
        path: "/moncompte",
        element: <UserAccount />,
      },
      {
        path: "/marque/:id",
        element: <Brand />,
      },
      {
        path: "/quizz",
        element: <Quizz />,
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
