import { useState, useEffect } from "react";

import { supabase } from "@/config/supabaseclient";

export interface Tag {
    tag_id: string;
    tag_name: string;
}

export const useFetchTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("Tag")
                .select("tag_id, tag_name")
                .eq("is_soft_deleted", false);

            if (error) throw error;

            let newTags: Tag[] = data ?? [];

            if (tags.length > 0) {
                newTags.sort(
                    (a, b) =>
                        tags.findIndex((t) => t.tag_id === a.tag_id) -
                        tags.findIndex((t) => t.tag_id === b.tag_id),
                );
            }

            setTags(newTags);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // fetch once on mount
    useEffect(() => {
        fetchTags();
    }, []);

    return { tags, loading, error, refetch: fetchTags };
};
