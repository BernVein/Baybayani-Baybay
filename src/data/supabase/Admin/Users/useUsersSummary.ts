import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

export function useUsersSummary() {
	const [summary, setSummary] = useState({
		individual: 0,
		cooperative: 0,
		admin: 0,
		forApproval: 0,
		lastApplicationDate: null as string | null,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<any>(null);

	const fetchSummary = useCallback(async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("User")
				.select("user_role, user_status, created_at")
				.eq("is_soft_deleted", false);

			if (error) throw error;

			const counts = {
				individual: 0,
				cooperative: 0,
				admin: 0,
				forApproval: 0,
				lastApplicationDate: null as string | null,
			};

			let latestApprovalDate: Date | null = null;

			data?.forEach((user) => {
				if (user.user_role === "Individual") counts.individual++;
				else if (user.user_role === "Cooperative") counts.cooperative++;
				else if (user.user_role === "Admin") counts.admin++;

				if (user.user_status === "For Approval") {
					counts.forApproval++;
					const appDate = new Date(user.created_at);
					if (!latestApprovalDate || appDate > latestApprovalDate) {
						latestApprovalDate = appDate;
						counts.lastApplicationDate = user.created_at;
					}
				}
			});

			setSummary(counts);
		} catch (err) {
			console.error("Failed to fetch users summary:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	return { ...summary, loading, error, refetch: fetchSummary };
}
