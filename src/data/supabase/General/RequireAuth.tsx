import { Navigate } from "react-router-dom";
import { useAuth } from "@/data/supabase/General/AuthContext/AuthProvider";
import { useLoginModal } from "@/data/supabase/General/AuthContext/LoginModalContext";
import { ReactNode, useEffect } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	const { openLoginModal } = useLoginModal();

	useEffect(() => {
		if (!loading && !user) {
			openLoginModal();
		}
	}, [loading, user, openLoginModal]);

	if (loading) return null;

	if (!user) {
		return <Navigate to="/shop" replace />;
	}

	return children;
}
