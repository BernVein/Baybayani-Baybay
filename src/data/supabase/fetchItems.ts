import { supabase } from "@/config/supabaseclient";
import { useEffect, useState } from "react";

export const useItemProvider = () => {
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [itemList, setItemList] = useState<any[] | null>(null);

	useEffect(() => {
		const fetchItem = async () => {
			const { data, error } = await supabase.from("Item").select();

			if (error) {
				setFetchError("Cannot fetch bitch, you suck!");
				setItemList(null);
				return;
			}

			setItemList(data);
			setFetchError(null);
		};

		fetchItem();
	}, []); // ✅ Correct position — only run once

	return { itemList, fetchError };
};
