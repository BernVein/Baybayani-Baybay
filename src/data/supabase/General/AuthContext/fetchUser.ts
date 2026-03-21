import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";
import { User as AuthUser } from "@supabase/supabase-js";

export function fetchUser() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = async (isInitial = false) => {
		if (isInitial) setLoading(true);
		const {
			data: { user: authUser },
		} = await supabase.auth.getUser();

		if (authUser) {
			setUser(authUser);

			const { data: profileData } = await supabase
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
				.eq("user_id", authUser.id)
				.maybeSingle();

			const userProfile: UserProfile = {
				user_id: authUser.id,
				user_name: profileData?.user_name,
				user_profile_img_url: profileData?.user_profile_img_url,
				user_role: profileData?.user_role,
				user_theme: profileData?.user_theme,
				login_user_name: profileData?.login_user_name,
				user_phone_number: profileData?.user_phone_number,
				user_status: profileData?.user_status,
			};
			setProfile(userProfile);
		} else {
			setUser(null);
			setProfile(null);
		}

		setLoading(false);
	};

	useEffect(() => {
		refresh(true);

		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			refresh(false);
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return {
		user,
		profile,
		loading,
		refresh,
	};
}
