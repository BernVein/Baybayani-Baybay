import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { addToast, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/config/supabaseclient";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

import RequireRole from "@/ContextProvider/AuthContext/RequireRole";
import RequireAuth from "@/ContextProvider/AuthContext/RequireAuth";
import RedirectAdmin from "@/ContextProvider/AuthContext/RedirectAdmin";
import RequireGuest from "@/ContextProvider/AuthContext/RequireGuest";
import RequireApproval from "@/ContextProvider/AuthContext/RequireApproval";
import { LoginModalProvider } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import { NotificationProvider } from "@/ContextProvider/NotificationContext/NotificationProvider";
import LoginModal from "@/pages/General/LoginModal";

const Cart = lazy(() => import("@/pages/Customer/CartPage/Cart/CartIndex"));
const Orders = lazy(() => import("@/pages/Customer/OrdersPage/OrderIndex"));
const Shop = lazy(() => import("@/pages/Customer/ShopPage/ShopIndex"));
const Settings = lazy(
	() => import("@/pages/Customer/UserAccount/SettingsPage/Settings"),
);
const CustomerAnnouncements = lazy(
	() => import("@/pages/Customer/Announcements"),
);
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const AdminOrders = lazy(() => import("@/pages/Admin/Orders"));
const AdminProducts = lazy(() => import("@/pages/Admin/Products"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminAnnouncements = lazy(() => import("@/pages/Admin/Announcements"));

const LoginPage = lazy(() => import("@/pages/General/Login"));
const SignUpPage = lazy(() => import("@/pages/General/SignUp"));
const NotFound = lazy(() => import("@/pages/General/NotFound"));

import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { registerPush } from "@/utils/PushNotification/registerPush";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";

function App() {
	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;

	useEffect(() => {
		if (user?.id) {
			registerPush();
		}
	}, [user?.id]);
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await unregisterPush();
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
	return (
		<LoginModalProvider>
			<NotificationProvider>
				<LoginModal />
				<ScrollToTop />
				<Suspense
					fallback={
						<div className="flex h-screen w-screen items-center justify-center">
							<Spinner color="success" size="lg" />
						</div>
					}
				>
					<Routes>
						{/* CUSTOMER ROUTES */}
						<Route
							path="/"
							element={
								<RedirectAdmin>
									<CustomerLayout
										user={user}
										profile={profile}
										handleSignOut={handleSignOut}
									/>
								</RedirectAdmin>
							}
						>
							<Route index element={<Shop />} />
							<Route element={<Shop />} path="/shop" />
							<Route
								element={
									<RequireAuth>
										<RequireApproval>
											<Cart />
										</RequireApproval>
									</RequireAuth>
								}
								path="/cart"
							/>
							<Route
								element={
									<RequireAuth>
										<RequireApproval>
											<Orders />
										</RequireApproval>
									</RequireAuth>
								}
								path="/orders"
							/>
							<Route
								element={
									<RequireAuth>
										<RequireApproval>
											<Settings />
										</RequireApproval>
									</RequireAuth>
								}
								path="/settings"
							/>
							<Route
								element={
									<RequireAuth>
										<RequireApproval>
											<CustomerAnnouncements />
										</RequireApproval>
									</RequireAuth>
								}
								path="/announcements"
							/>
						</Route>

						<Route
							element={
								<RequireGuest>
									<LoginPage />
								</RequireGuest>
							}
							path="/login"
						/>
						<Route
							element={
								<RequireGuest>
									<SignUpPage />
								</RequireGuest>
							}
							path="/signup"
						/>

						{/* ADMIN ROUTES */}
						<Route
							path="/admin"
							element={
								<RequireRole allowedRoles={["Admin"]}>
									<RequireApproval>
										<AdminLayout />
									</RequireApproval>
								</RequireRole>
							}
						>
							<Route
								index
								element={<Navigate to="dashboard" replace />}
							/>
							<Route element={<Dashboard />} path="dashboard" />
							<Route element={<AdminOrders />} path="orders" />
							<Route
								element={<AdminProducts />}
								path="products"
							/>
							<Route element={<AdminUsers />} path="users" />
							<Route
								element={<AdminAnnouncements />}
								path="announcements"
							/>
							<Route element={<Settings />} path="settings" />
						</Route>

						{/* CATCH ALL */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</NotificationProvider>
		</LoginModalProvider>
	);
}

export default App;
