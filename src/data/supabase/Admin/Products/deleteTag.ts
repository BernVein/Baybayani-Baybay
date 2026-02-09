import { supabase } from "@/config/supabaseclient";

export async function deleteTag(tagId: string) {
  try {
    // Check if any items are using this tag
    const { count, error: countError } = await supabase
      .from("Item")
      .select("item_id", { count: "exact", head: true })
      .eq("tag_id", tagId)
      .eq("is_soft_deleted", false);

    if (countError) {
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return { success: false, error: "TAG_IN_USE", count };
    }

    // Soft-delete the tag
    const { error: deleteError } = await supabase
      .from("Tag")
      .update({ is_soft_deleted: true })
      .eq("tag_id", tagId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }
    window.dispatchEvent(new Event("baybayani:update-table"));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "UNKNOWN_ERROR" };
  }
}
