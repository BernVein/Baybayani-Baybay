import { Navigate } from "react-router-dom";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode } from "react";

export default function RedirectAdmin({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const profile = auth?.profile;
	const loading = auth?.loading;

	if (loading) return null;

	if (profile?.user_role === "Admin") {
		return <Navigate to="/admin/dashboard" replace />;
	}

	return children;
}
