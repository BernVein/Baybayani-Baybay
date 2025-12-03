import { Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/navbar/navbarDesktop";
import { NavbarMobile } from "./components/navbar/navbarMobile";
import { useState, lazy, Suspense } from "react";
import { Skeleton } from "@heroui/react";

const Cart = lazy(() => import("@/pages/Customer/CartPage/Cart/CartIndex"));
const Orders = lazy(() => import("@/pages/Customer/OrdersPage/Orders"));
const Shop = lazy(() => import("@/pages/Customer/ShopPage/ShopIndex"));
const Profile = lazy(() => import("@/pages/Customer/UserAccount/ProfilePage/Profile"));
const Settings = lazy(() => import("@/pages/Customer/UserAccount/SettingsPage/Settings"));
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
				<Suspense
					fallback={
						<div className="p-5 md:p-10 flex flex-col gap-4 md:w-3/4 mx-auto">
							<Skeleton className="h-6 w-1/3 rounded" />
							<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 mt-2 mb-2">
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="flex flex-col gap-2">
										<Skeleton className="h-[140px] w-full rounded-lg" />
										<Skeleton className="h-4 w-1/2 rounded" />
										<Skeleton className="h-5 w-full rounded" />
										<Skeleton className="h-4 w-3/4 rounded" />
									</div>
								))}
							</div>
						</div>
					}
				>
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
				</Suspense>
			</main>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
				<NavbarMobile />
			</div>
		</div>
	);
}

export default App;
