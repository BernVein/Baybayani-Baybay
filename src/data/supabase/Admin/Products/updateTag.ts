import { supabase } from "@/config/supabaseclient";
import { Tag } from "@/data/supabase/useFetchTags";

export async function updateTag(tag: Tag) {
  try {
    const { error } = await supabase
      .from("Tag")
      .update({ tag_name: tag.tag_name })
      .eq("tag_id", tag.tag_id);

    if (error) {
      return { success: false, error: error.message };
    }
    window.dispatchEvent(new Event("baybayani:update-table"));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "UNKNOWN_ERROR" };
  }
}
