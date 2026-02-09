export interface ItemTableRow {
  item_id: string;
  item_img_url: string;
  item_name: string;
  item_variant_count: number;
  item_min_price: number;
  item_sold_by: string;
  variant_stock: number;
  item_category: string;
  item_category_id: string | null; // for filtering purposes
  item_has_variant: boolean; // for filtering purposes
  item_tag?: string;
}
