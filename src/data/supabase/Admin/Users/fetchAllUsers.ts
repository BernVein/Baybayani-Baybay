import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";

export const fetchAllUsers = () => {
	const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setFetchError(null);

		const { data, error } = await supabase
			.from("User")
			.select(
				`
				user_id,
				user_name,
				user_role,
				user_profile_img_url,
				user_theme,
				fcm_token,
				login_user_name,
				user_phone_number,
				user_status,
				created_at,
				User_Valid_Identification(valid_id_img_url)
				`,
			)
			.eq("is_soft_deleted", false);

		if (error) {
			setFetchError(error.message);
			setUserProfiles([]);
			setLoading(false);
			return;
		}

		if (!data) {
			setUserProfiles([]);
			setLoading(false);
			return;
		}

		const mappedUsers = data.map((user: any) => ({
			user_id: user.user_id,
			user_name: user.user_name,
			user_theme: user.user_theme,
			login_user_name: user.login_user_name,
			user_phone_number: user.user_phone_number,
			user_fcm_token: user.fcm_token,
			user_role: user.user_role,
			user_profile_img_url: user.user_profile_img_url,
			user_status: user.user_status,

			valid_ids:
				user.User_Valid_Identification?.map(
					(img: any) => img.valid_id_img_url,
				) ?? [],
		})) as UserProfile[];

		setUserProfiles(mappedUsers);
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	return {
		userProfiles,
		setUserProfiles,
		loading,
		fetchError,
		refetch: fetchItem,
	};
};
