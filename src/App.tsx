import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { addToast, Skeleton } from "@heroui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/config/supabaseclient";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

import RequireRole from "@/ContextProvider/AuthContext/RequireRole";
import RequireAuth from "@/ContextProvider/AuthContext/RequireAuth";
import { LoginModalProvider } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import LoginModal from "@/pages/General/LoginModal";

const Cart = lazy(() => import("@/pages/Customer/CartPage/Cart/CartIndex"));
const Orders = lazy(() => import("@/pages/Customer/OrdersPage/OrderIndex"));
const Shop = lazy(() => import("@/pages/Customer/ShopPage/ShopIndex"));
const Message = lazy(() => import("@/pages/Customer/MessagePage/MessageIndex"));
const Profile = lazy(
	() => import("@/pages/Customer/UserAccount/ProfilePage/Profile"),
);
const Settings = lazy(
	() => import("@/pages/Customer/UserAccount/SettingsPage/Settings"),
);
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const AdminOrders = lazy(() => import("@/pages/Admin/Orders"));
const AdminProducts = lazy(() => import("@/pages/Admin/Products"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminMessages = lazy(() => import("@/pages/Admin/Messages"));

const LoginPage = lazy(() => import("@/pages/General/Login"));

import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

function App() {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await supabase.auth.signOut();
			navigate("/shop");
			addToast({
				title: "Sign out",
				description: "You have been signed out successfully",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		} catch (error) {
			addToast({
				title: "Error",
				description: error as string,
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		}
	};
	function ScrollToTop() {
		const { pathname } = useLocation();

		useEffect(() => {
			window.scrollTo(0, 0);
		}, [pathname]);

		return null;
	}
	const { user, profile } = useAuth();

	return (
		<LoginModalProvider>
			<LoginModal />
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
					<Route
						path="/"
						element={
							<CustomerLayout
								user={user}
								profile={profile}
								handleSignOut={handleSignOut}
							/>
						}
					>
						<Route index element={<Shop />} />
						<Route element={<Shop />} path="/shop" />
						<Route
							element={
								<RequireAuth>
									<Cart />
								</RequireAuth>
							}
							path="/cart"
						/>
						<Route
							element={
								<RequireAuth>
									<Orders />
								</RequireAuth>
							}
							path="/orders"
						/>
						<Route
							element={
								<RequireAuth>
									<Profile />
								</RequireAuth>
							}
							path="/profile"
						/>
						<Route
							element={
								<RequireAuth>
									<Settings />
								</RequireAuth>
							}
							path="/settings"
						/>
						<Route
							element={
								<RequireAuth>
									<Message />
								</RequireAuth>
							}
							path="/messages"
						/>
					</Route>

					<Route element={<LoginPage />} path="/login" />

					{/* ADMIN ROUTES */}
					<Route
						path="/admin"
						element={
							<RequireRole allowedRoles={["Admin"]}>
								<AdminLayout />
							</RequireRole>
						}
					>
						<Route element={<Dashboard />} path="dashboard" />
						<Route element={<AdminOrders />} path="orders" />
						<Route element={<AdminProducts />} path="products" />
						<Route element={<AdminUsers />} path="users" />
						<Route element={<AdminMessages />} path="messages" />
					</Route>
				</Routes>
			</Suspense>
		</LoginModalProvider>
	);
}

export default App;
