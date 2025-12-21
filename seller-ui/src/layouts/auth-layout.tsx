import { ShoppingCart } from "lucide-react"
import { Link, Outlet } from "react-router-dom"

const AuthLayout = () => {
    return (

        <div className="min-h-screen bg-background flex flex-col items-center justify-center py-10">

            {/* Shared Header / Logo */}
            <div className="mb-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary text-secondary p-1.5 rounded-md">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-primary italic">
                        MarketHub
                    </span>
                    <span className="text-xl font-bold tracking-tight">Sellers</span>
                </Link>
            </div>

            {/* The Page Content (Login or Register form goes here) */}
            <div className="w-full max-w-3xl">
                <Outlet />
            </div>

            {/* Shared Footer */}
            <footer className="mt-8 text-center space-y-4 w-full max-w-100">
                <div className="h-px w-full bg-linear-to-r from-transparent via-slate-300 to-transparent" />
                <div className="flex justify-center gap-6 text-xs text-blue-700">
                    <Link to="/conditions" className="hover:underline hover:text-orange-700">
                        Conditions of Use
                    </Link>
                    <Link to="/privacy" className="hover:underline hover:text-orange-700">
                        Privacy Notice
                    </Link>
                    <Link to="/help" className="hover:underline hover:text-orange-700">
                        Help
                    </Link>
                </div>
                <p className="text-xs text-slate-500">© 1996-2024, MarketHub, Inc.</p>
            </footer>
        </div>
    )
}

export default AuthLayout