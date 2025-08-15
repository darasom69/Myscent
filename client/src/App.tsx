import "./App.css";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
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
              <Header />
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
