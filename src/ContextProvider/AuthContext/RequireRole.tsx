import { Navigate } from "react-router-dom";

import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode } from "react";

type Role = "Admin" | "Individual" | "Cooperative";

export default function RequireRole({
	children,
	allowedRoles,
}: {
	children: ReactNode;
	allowedRoles: Role[];
}) {
	const { role, loading } = useAuth();

	if (loading) return null;

	if (!allowedRoles.includes(role)) {
		return <Navigate to="/" replace />;
	}

	return children;
}
