import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";

export interface NavbarItem {
    item_id: string;
    item_title: string;
    item_category: string;
    item_first_img?: string;
}

export const useFetchNavbarItems = () => {
    const [items, setItems] = useState<NavbarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("Item")
                    .select(
                        "item_id, item_title, Category(category_name), Item_Image(item_image_url)",
                    )
                    .eq("is_soft_deleted", false)
                    .order("item_title", { ascending: true })
                    .limit(50); // you can adjust as needed

                if (error) throw error;

                const mapped = (data ?? []).map((row: any) => ({
                    item_id: row.item_id,
                    item_title: row.item_title,
                    item_category: row.Category?.category_name ?? "",
                    item_first_img: row.Item_Image?.[0]?.item_image_url ?? "",
                }));

                setItems(mapped);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return { items, loading, error };
};
