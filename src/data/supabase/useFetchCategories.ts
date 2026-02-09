import { useState, useEffect } from "react";

import { supabase } from "@/config/supabaseclient";

export interface Category {
    category_id: string;
    category_name: string;
}

export const useFetchCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Category")
                .select("category_id, category_name")
                .eq("is_soft_deleted", false);

            if (error) throw error;

            let newCategories: Category[] = (data ?? []).map((row: any) => ({
                category_id: row.category_id,
                category_name: row.category_name,
            }));

            // Preserve previous order
            if (categories.length > 0) {
                newCategories.sort(
                    (a, b) =>
                        categories.findIndex(
                            (c) => c.category_id === a.category_id,
                        ) -
                        categories.findIndex(
                            (c) => c.category_id === b.category_id,
                        ),
                );
            }

            setCategories(newCategories);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, refetch: fetchCategories };
};
