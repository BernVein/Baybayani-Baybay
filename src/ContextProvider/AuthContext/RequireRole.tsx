import { Navigate } from "react-router-dom";

import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode } from "react";
import { UserProfile } from "@/model/userProfile";
import FullPageLoader from "@/components/General/FullPageLoader";

export default function RequireRole({
	children,
	allowedRoles,
}: {
	children: ReactNode;
	allowedRoles: UserProfile["user_role"][];
}) {
	const auth = useAuth();
	const profile = auth?.profile;
	const loading = auth?.loading;

	if (loading) return <FullPageLoader />;

	if (!profile || !allowedRoles.includes(profile.user_role)) {
		return <Navigate to="/" replace />;
	}

	return children;
}
