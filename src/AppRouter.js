import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
// import GuideOMAC from "./components/GuideOMAC";
import App from "./App";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                
                <Route path="/admin" element={<Admin />} />
                
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* <Route path="/guide" element={<GuideOMAC />} /> */}
            </Routes>
        </Router>
    ); 
}; 

export default AppRouter;