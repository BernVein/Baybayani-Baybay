import { Navigate } from "react-router-dom";

import { useAuth } from "@/data/supabase/General/AuthContext/AuthProvider";
import { ReactNode } from "react";
export default function RequireRole({
	children,
	allowedRoles,
}: {
	children: ReactNode;
	allowedRoles: string[];
}) {
	const { role, loading } = useAuth();

	if (loading) return null;

	if (!allowedRoles.includes(role)) {
		return <Navigate to="/" replace />;
	}

	return children;
}
