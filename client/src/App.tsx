import "./App.css";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { PerfumeProvider } from "./context/PerfumeContext";

function App() {
  return (
    <PerfumeProvider>
      <Header />
      <Outlet />
      <Footer />
    </PerfumeProvider>
  );
}

export default App;
