import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { fetchUser } from "@/data/supabase/General/AuthContext/fetchUser";
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { user, profile, role, loading } = fetchUser();
	return (
		<AuthContext.Provider value={{ user, profile, role, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
