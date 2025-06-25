import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Admin from "./components/Admin"
import AdminDashboard from "./components/AdminDashboard"
import GuideOMAC from "./components/GuideOMAC"
import ProjetSocial from "./components/ProjetSocial"
import Jeunesse from "./components/Jeunesse"
import Scolarite from "./components/Scolarite"
import Famille from "./components/Famille"
import App from "./App"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Pages avec header */}
        <Route
          path="/"
          element={
            <Layout>
              <App />
            </Layout>
          }
        />

        <Route
          path="/guide"
          element={
            <Layout>
              <GuideOMAC />
            </Layout>
          }
        />

        <Route
          path="/projet-social"
          element={
            <Layout>
              <ProjetSocial />
            </Layout>
          }
        />

        <Route
          path="/jeunesse"
          element={
            <Layout>
              <Jeunesse />
            </Layout>
          }
        />

        <Route
          path="/scolarite"
          element={
            <Layout>
              <Scolarite />
            </Layout>
          }
        />

        <Route
          path="/famille"
          element={
            <Layout>
              <Famille />
            </Layout>
          }
        />

        {/* Pages admin sans header */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
