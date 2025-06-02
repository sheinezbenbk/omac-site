import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
import GuideOMAC from "./components/GuideOMAC";
import ProjetSocial from "./components/ProjetSocial"; 
import Jeunesse from "./components/Jeunesse"; 
import Scolarite from "./components/Scolarite";
import Famille from "./components/Famille";
import App from "./App";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                
                <Route path="/admin" element={<Admin />} />
                
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                <Route path="/guide" element={<GuideOMAC />} />
                
                <Route path="/projet-social" element={<ProjetSocial />} /> 

                <Route path="/jeunesse" element={<Jeunesse />} />
                
                <Route path="/scolarite" element={<Scolarite />} />
                
                <Route path="/famille" element={<Famille />} />


            </Routes>
        </Router>
    ); 
}; 

export default AppRouter;