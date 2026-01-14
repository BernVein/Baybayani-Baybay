import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@heroui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

const Cart = lazy(() => import("@/pages/Customer/CartPage/Cart/CartIndex"));
const Orders = lazy(() => import("@/pages/Customer/OrdersPage/OrderIndex"));
const Shop = lazy(() => import("@/pages/Customer/ShopPage/ShopIndex"));
const Profile = lazy(
	() => import("@/pages/Customer/UserAccount/ProfilePage/Profile")
);
const Settings = lazy(
	() => import("@/pages/Customer/UserAccount/SettingsPage/Settings")
);
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const AdminOrders = lazy(() => import("@/pages/Admin/Orders"));
const AdminProducts = lazy(() => import("@/pages/Admin/Products"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminMessages = lazy(() => import("@/pages/Admin/Messages"));

function App() {
	function ScrollToTop() {
		const { pathname } = useLocation();

		useEffect(() => {
			window.scrollTo(0, 0);
		}, [pathname]);

		return null;
	}
	return (
		<Suspense
			fallback={
				<div className="p-5 md:p-10 flex flex-col gap-4 md:w-3/4 mx-auto">
					<Skeleton className="h-6 w-1/3 rounded" />
				</div>
			}
		>
			<ScrollToTop />
			<Routes>
				{/* CUSTOMER ROUTES */}
				<Route element={<CustomerLayout />}>
					<Route path="/" element={<Shop />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/settings" element={<Settings />} />
				</Route>

				{/* ADMIN ROUTES */}
				<Route path="/admin" element={<AdminLayout />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="orders" element={<AdminOrders />} />
					<Route path="products" element={<AdminProducts />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="messages" element={<AdminMessages />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
