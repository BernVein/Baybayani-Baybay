import { Route, Routes } from "react-router-dom";
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
import { LoginModalProvider } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import LoginModal from "@/pages/General/LoginModal";

const Cart = lazy(() => import("@/pages/Customer/CartPage/Cart/CartIndex"));
const Orders = lazy(() => import("@/pages/Customer/OrdersPage/OrderIndex"));
const Shop = lazy(() => import("@/pages/Customer/ShopPage/ShopIndex"));
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

const LoginPage = lazy(() => import("@/pages/General/Login"));
const SignUpPage = lazy(() => import("@/pages/General/SignUp"));

import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

function App() {
	useEffect(() => {
		if (Capacitor.getPlatform() !== "android") return;

		const setupPush = async () => {
			const permission = await PushNotifications.requestPermissions();

			if (permission.receive !== "granted") {
				alert("Push permission not granted");
				return;
			}

			await PushNotifications.register();

			// Show the token directly on your phone
			PushNotifications.addListener("registration", (token) => {
				alert("🔥 FCM TOKEN: " + token.value);
				console.log("🔥 FCM TOKEN:", token.value);
			});

			PushNotifications.addListener("registrationError", (err) => {
				alert("Registration error: " + JSON.stringify(err));
				console.error("Registration error:", err);
			});

			// Show a popup when a push arrives in the foreground
			PushNotifications.addListener(
				"pushNotificationReceived",
				(notification) => {
					alert(
						"Push received: " +
							notification.title +
							"\n" +
							notification.body,
					);
					console.log("Push received:", notification);
				},
			);

			// Handle notification tap (app in background/killed)
			PushNotifications.addListener(
				"pushNotificationActionPerformed",
				(notification) => {
					console.log("Notification tapped:", notification);
				},
			);
		};

		setupPush();

		// Cleanup listeners to prevent duplicates on re-render
		return () => {
			PushNotifications.removeAllListeners();
		};
	}, []);
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
	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;

	return (
		<LoginModalProvider>
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
								<AdminLayout />
							</RequireRole>
						}
					>
						<Route element={<Dashboard />} path="dashboard" />
						<Route element={<AdminOrders />} path="orders" />
						<Route element={<AdminProducts />} path="products" />
						<Route element={<AdminUsers />} path="users" />
					</Route>
				</Routes>
			</Suspense>
		</LoginModalProvider>
	);
}

export default App;
