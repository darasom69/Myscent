import "./App.css";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { BrandProvider } from "./context/BrandContext";
import { PerfumeProvider } from "./context/PerfumeContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <PerfumeProvider>
      <BrandProvider>
        <UserProvider>
          <Header />
          <Outlet />
          <Footer />
        </UserProvider>
      </BrandProvider>
    </PerfumeProvider>
  );
}

export default App;
