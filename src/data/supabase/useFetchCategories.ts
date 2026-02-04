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

            const mapped: Category[] = (data ?? []).map((row: any) => ({
                category_id: row.category_id,
                category_name: row.category_name,
            }));

            setCategories(mapped);
        } catch (err: any) {
            console.error(err);
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
