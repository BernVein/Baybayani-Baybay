import { Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/navbar/navbarDesktop";
import Cart from "@/pages/Customer/CartPage/Cart/CartIndex";
import Orders from "@/pages/Customer/OrdersPage/Orders";
import Shop from "@/pages/Customer/ShopPage/ShopIndex";
import Profile from "@/pages/Customer/UserAccount/ProfilePage/Profile";
import Settings from "@/pages/Customer/UserAccount/SettingsPage/Settings";
import { NavbarMobile } from "./components/navbar/navbarMobile";
import { useState } from "react";
function App() {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	return (
		<div className="relative min-h-screen bg-background text-foreground">
			{/* Top Navbar */}
			<div className="fixed top-0 left-0 w-full z-50">
				<Navbar setSearchTerm={setSearchTerm} />
			</div>

			{/* Main content area */}
			<main className="pt-[64px] pb-[64px]">
				<Routes>
					<Route element={<Cart />} path="/cart" />
					<Route element={<Orders />} path="/orders" />
					<Route
						element={
							<Shop
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
							/>
						}
						path="/"
					/>
					<Route element={<Profile />} path="/profile" />
					<Route element={<Settings />} path="/settings" />
				</Routes>
			</main>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
				<NavbarMobile />
			</div>
		</div>
	);
}

export default App;
