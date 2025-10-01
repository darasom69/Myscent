import "./App.css";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { BrandProvider } from "./context/BrandContext";
import { CollectionProvider } from "./context/CollectionContext";
import { PerfumeProvider } from "./context/PerfumeContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <PerfumeProvider>
      <BrandProvider>
        <UserProvider>
          <AuthProvider>
            <CollectionProvider>
              <Navbar />
              <Outlet />
              <Footer />
            </CollectionProvider>
          </AuthProvider>
        </UserProvider>
      </BrandProvider>
    </PerfumeProvider>
  );
}

export default App;
