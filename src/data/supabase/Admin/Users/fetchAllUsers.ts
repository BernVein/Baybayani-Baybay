import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";

export interface SortConfig {
	column: string;
	ascending: boolean;
}

export const fetchAllUsers = (
	searchTerm: string = "",
	sortConfig: SortConfig = { column: "created_at", ascending: false },
	roles: string[] = [],
	statuses: string[] = [],
) => {
	const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setFetchError(null);

		let query = supabase
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
				created_at
				`,
			)
			.eq("is_soft_deleted", false)
			.eq("is_for_debugging", false);

		if (searchTerm) {
			query = query.ilike("user_name", `%${searchTerm}%`);
		}

		if (roles.length > 0) {
			query = query.in("user_role", roles);
		}

		if (statuses.length > 0) {
			query = query.in("user_status", statuses);
		}

		const { data, error } = await query.order(sortConfig.column, {
			ascending: sortConfig.ascending,
		});

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

			created_at: user.created_at,
		})) as UserProfile[];

		setUserProfiles(mappedUsers);
		setLoading(false);
	}, [searchTerm, sortConfig, roles, statuses]);

	useEffect(() => {
		const handler = setTimeout(() => {
			fetchItem();
		}, 300); // Small debounce to avoid too many requests while typing

		return () => clearTimeout(handler);
	}, [fetchItem]);

	return {
		userProfiles,
		setUserProfiles,
		loading,
		fetchError,
		refetch: fetchItem,
	};
};
