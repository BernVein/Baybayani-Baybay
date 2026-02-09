export interface OrderTableRow {
  order_id: string;
  user_name: string;
  user_role: string;
  date_ordered: string;
  item_name: string;
  item_variant_name: string;
  item_quantity: number;
  subtotal: number;
  price_variant: string;
  status: string;
}
