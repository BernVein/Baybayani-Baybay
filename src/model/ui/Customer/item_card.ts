export interface ItemCard {
  item_id: string;
  item_category: string;
  item_tag?: string | null;
  item_title: string;
  item_first_img: string;
  item_first_variant_retail_price: number;
  item_sold_by: string;
}
