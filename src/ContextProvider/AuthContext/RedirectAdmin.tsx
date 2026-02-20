import { Navigate } from "react-router-dom";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode } from "react";

export default function RedirectAdmin({ children }: { children: ReactNode }) {
	const { role, loading } = useAuth();

	if (loading) return null;

	if (role === "Admin") {
		return <Navigate to="/admin/dashboard" replace />;
	}

	return children;
}
