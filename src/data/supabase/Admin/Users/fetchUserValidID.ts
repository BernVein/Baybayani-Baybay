import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

export const useUserValidIDs = (userID: string) => {
	const [userValidIDLink, setUserValidIDLink] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const fetchIDLink = useCallback(async () => {
		if (!userID) return;

		setLoading(true);
		setFetchError(null);

		try {
			const { data, error } = await supabase
				.from("User_Valid_Identification")
				.select("valid_id_img_url")
				.eq("user_id", userID);

			if (error) {
				setFetchError(error.message);
				setUserValidIDLink([]);
				return;
			}

			const urls = data?.map((item) => item.valid_id_img_url) || [];
			setUserValidIDLink(urls);
		} catch (err: any) {
			setFetchError(err.message || "Unknown error");
			setUserValidIDLink([]);
		} finally {
			setLoading(false);
		}
	}, [userID]);

	useEffect(() => {
		fetchIDLink();
	}, [fetchIDLink]);

	return {
		userValidIDLink,
		setUserValidIDLink,
		loading,
		fetchError,
		refetch: fetchIDLink,
	};
};
