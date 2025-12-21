import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import AuthLayout from "./layouts/auth-layout";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";

export function App() {
    return <>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/auth" element={<AuthLayout />} >
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage/>} />
            </Route>
            <Route path="/app" element={<DashboardLayout />} />
        </Routes>
    </>;
}

export default App;