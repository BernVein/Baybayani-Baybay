import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";

interface Tag {
    tag_id: string;
    tag_name: string;
}

export const useFetchTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("Tag")
                    .select("tag_id, tag_name")
                    .eq("is_soft_deleted", false);

                if (error) throw error;

                setTags(data ?? []);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return { tags, loading, error };
};
