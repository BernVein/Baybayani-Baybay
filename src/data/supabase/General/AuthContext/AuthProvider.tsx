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
			console.log(user);
			if (user) {
				setUser(user);

				const { data: profile } = await supabase
					.from("User")
					.select("user_role")
					.eq("user_id", user.id)
					.single();

				setRole(profile?.user_role ?? null);
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
