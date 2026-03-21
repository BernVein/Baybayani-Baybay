import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { fetchUser } from "@/data/supabase/General/AuthContext/fetchUser";
import { UserProfile } from "@/model/userProfile";
import { User as AuthUser } from "@supabase/supabase-js";

const AuthContext = createContext<{
	user: AuthUser | null;
	profile: UserProfile | null;
	loading: boolean;
	refresh: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { user, profile, loading, refresh } = fetchUser();
	return (
		<AuthContext.Provider value={{ user, profile, loading, refresh }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
