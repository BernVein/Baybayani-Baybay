import { supabase } from "@/config/supabaseclient";
import { Category } from "@/data/supabase/useFetchCategories";

export async function updateCategory(category: Category) {
  try {
    const { error } = await supabase
      .from("Category")
      .update({ category_name: category.category_name })
      .eq("category_id", category.category_id);

    if (error) {
      return { success: false, error: error.message };
    }
    window.dispatchEvent(new Event("baybayani:update-table"));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "UNKNOWN_ERROR" };
  }
}
