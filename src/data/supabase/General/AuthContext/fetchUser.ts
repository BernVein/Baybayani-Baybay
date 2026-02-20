import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";

export function fetchUser() {
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<any>(null);
	const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser(user);

				const { data: profile } = await supabase
					.from("User")
					.select(
						"user_name, user_profile_img_url, user_role, user_theme",
					)
					.eq("user_id", user.id)
					.single();
				setProfile(profile);
				setRole(profile?.user_role ?? null);
			} else {
				setUser(null);
				setProfile(null);
				setRole(null);
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

	return {
		user,
		profile,
		role,
		loading,
	};
}
