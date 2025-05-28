import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
import GuideOMAC from "./components/GuideOMAC";
import ProjetSocial from "./components/ProjetSocial"; // ✅ Import du nouveau composant
import App from "./App";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                
                <Route path="/admin" element={<Admin />} />
                
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                <Route path="/guide" element={<GuideOMAC />} />
                
                <Route path="/projet-social" element={<ProjetSocial />} /> {/* ✅ Nouvelle route */}
            </Routes>
        </Router>
    ); 
}; 

export default AppRouter;