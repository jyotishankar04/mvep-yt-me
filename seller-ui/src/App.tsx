import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";

export function App() {
    return <>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/app" element={<DashboardLayout> <h1>Dashboard</h1> </DashboardLayout>} />
        </Routes>
    </>;
}

export default App;