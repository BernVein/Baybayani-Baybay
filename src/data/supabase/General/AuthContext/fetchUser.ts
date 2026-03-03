import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";
import { User as AuthUser } from "@supabase/supabase-js";

export function fetchUser() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async (isInitial = false) => {
			if (isInitial) setLoading(true);
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUser(user);

				const { data: profile } = await supabase
					.from("User")
					.select(
						`
						user_name,
						user_profile_img_url,
						user_role,
						user_theme,
						login_user_name,
						user_phone_number,
						user_status
						`,
					)
					.eq("user_id", user.id)
					.maybeSingle();

				const userProfile: UserProfile = {
					user_id: user.id,
					user_name: profile?.user_name,
					user_profile_img_url: profile?.user_profile_img_url,
					user_role: profile?.user_role,
					user_theme: profile?.user_theme,
					login_user_name: profile?.login_user_name,
					user_phone_number: profile?.user_phone_number,
					user_status: profile?.user_status,
				};
				setProfile(userProfile);
			} else {
				setUser(null);
				setProfile(null);
			}

			setLoading(false);
		};

		fetchUser(true);

		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			fetchUser(false);
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return {
		user,
		profile,
		loading,
	};
}
