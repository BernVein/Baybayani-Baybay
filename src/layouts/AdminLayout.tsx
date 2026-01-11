import { Outlet } from "react-router-dom";

export default function AdminLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Admin Navbar */}
			<h1>Admin Layout</h1>
			<main className="p-6">
				<Outlet />
			</main>
		</div>
	);
}
