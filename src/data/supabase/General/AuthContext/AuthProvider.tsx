import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { ReactNode } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				setUser(user);

				const { data: profile } = await supabase
					.from("users")
					.select("role")
					.eq("id", user.id)
					.single();

				setRole(profile?.role ?? null);
			}

			setLoading(false);
		};

		fetchUser();

		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			fetchUser();
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, role, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
