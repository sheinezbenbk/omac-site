import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import App from "./App";

const AppRouter = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<App/>} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Router>
        </div>
    ); 
}; 

export default AppRouter;