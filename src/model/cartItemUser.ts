import { VariantSnapshot } from "./variantSnapshot";

import { Item } from "@/model/Item.js";

export interface CartItemUser {
  cart_item_user_id: string;
  item: Item;
  variant_snapshot: VariantSnapshot; // snapshot of variant at time added
  price_variant: string;
  quantity: number;
  subtotal: number;
  is_soft_deleted: boolean;
  created_at: string;
  updated_at: string;
}
