import { Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import Cart from "@/pages/Customer/CartPage/Cart";
import Orders from "@/pages/Customer/OrdersPage/Orders";
import Shop from "@/pages/Customer/ShopPage/Shop";
import Profile from "@/pages/Customer/UserAccount/ProfilePage/Profile";
import Settings from "@/pages/Customer/UserAccount/SettingsPage/Settings";

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route element={<Cart />} path="/cart" />
				<Route element={<Orders />} path="/orders" />
				<Route element={<Shop />} path="/" />
				<Route element={<Profile />} path="/profile" />
				<Route element={<Settings />} path="/settings" />
			</Routes>
		</>
	);
}

export default App;
