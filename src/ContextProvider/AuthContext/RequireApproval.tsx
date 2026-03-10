import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import RestrictedAccessModal from "@/pages/General/RestrictedAccessModal";
import { supabase } from "@/config/supabaseclient";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";
import { addToast } from "@heroui/react";

export default function RequireApproval({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const profile = auth?.profile;
	const loading = auth?.loading;
	const location = useLocation();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isRestricted =
		profile?.user_status === "For Approval" ||
		profile?.user_status === "Rejected" ||
		profile?.user_status === "Suspended";

	// Public routes that don't need approval
	const isPublicRoute =
		location.pathname === "/" ||
		location.pathname === "/shop" ||
		location.pathname === "/login" ||
		location.pathname === "/signup";

	useEffect(() => {
		if (!loading && isRestricted && !isPublicRoute) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [loading, isRestricted, isPublicRoute]);

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

	if (loading) return null;

	// If the user is on a restricted route and not approved, show the modal but also provide a fallback or redirect
	// Actually, the requirement is "they can still normally login but they cannot access any other page, only /shop or /."
	if (isRestricted && !isPublicRoute) {
		return (
			<>
				<RestrictedAccessModal
					isOpen={isModalOpen}
					onOpenChange={setIsModalOpen}
					status={profile?.user_status || ""}
					onSignOut={handleSignOut}
				/>
				{/* We still render children but they are covered by the modal backdrop */}
				{/* Alternatively, we can return null or a placeholder to prevent sensitive data from rendering */}
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
			</>
		);
	}

	return <>{children}</>;
}
