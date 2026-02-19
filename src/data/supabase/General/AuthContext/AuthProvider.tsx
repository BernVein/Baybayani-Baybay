import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { ReactNode } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<any>(null);
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
					.from("User")
					.select("user_name, user_profile_img_url, user_role")
					.eq("user_id", user.id)
					.single();

				setProfile(profile);
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
		<AuthContext.Provider value={{ user, profile, role, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
