import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard-layout";
import AuthLayout from "./layouts/auth-layout";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import ProductCreatePage from "./pages/products/product-create";

export function App() {
    return <>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/auth" element={<AuthLayout />} >
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage/>} />
            </Route>
            <Route path="/app" element={<DashboardLayout />} >
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="products" element={<h1>Products</h1>} />
                <Route path="products/create" element={<ProductCreatePage/>} />
            </Route>
        </Routes>
    </>;
}

export default App;