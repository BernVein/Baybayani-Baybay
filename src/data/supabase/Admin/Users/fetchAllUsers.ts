import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";

export interface SortConfig {
	column: string;
	ascending: boolean;
}

const DEFAULT_SORT_CONFIG: SortConfig = {
	column: "created_at",
	ascending: false,
};
const DEFAULT_ROLES: string[] = [];
const DEFAULT_STATUSES: string[] = [];

export const fetchAllUsers = (
	searchTerm: string = "",
	sortConfig: SortConfig = DEFAULT_SORT_CONFIG,
	roles: string[] = DEFAULT_ROLES,
	statuses: string[] = DEFAULT_STATUSES,
	page: number = 1,
	pageSize: number = 20,
) => {
	const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);

	const fetchItem = useCallback(async () => {
		setLoading(true);
		setFetchError(null);

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from("User")
			.select(
				`
				user_id,
				user_name,
				user_role,
				user_profile_img_url,
				user_theme,
				login_user_name,
				user_phone_number,
				user_status,
				created_at
				`,
				{ count: "exact" },
			)
			.eq("is_soft_deleted", false);

		if (searchTerm) {
			query = query.ilike("user_name", `%${searchTerm}%`);
		}

		if (roles.length > 0) {
			query = query.in("user_role", roles);
		}

		if (statuses.length > 0) {
			query = query.in("user_status", statuses);
		}

		const { data, error, count } = await query
			.order(sortConfig.column, {
				ascending: sortConfig.ascending,
			})
			.range(from, to);

		if (error) {
			setFetchError(error.message);
			setUserProfiles([]);
			setTotalCount(0);
			setLoading(false);
			return;
		}

		setTotalCount(count ?? 0);

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
			user_role: user.user_role,
			user_profile_img_url: user.user_profile_img_url,
			user_status: user.user_status,

			created_at: user.created_at,
		})) as UserProfile[];

		setUserProfiles(mappedUsers);
		setLoading(false);
	}, [searchTerm, sortConfig, roles, statuses, page, pageSize]);

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
		totalCount,
		pageSize,
		refetch: fetchItem,
	};
};
