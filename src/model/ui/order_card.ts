export interface OrderCard {
    order_item_user_id: string;
    variant_name: string;
    variant_snapshot_id: string;
    item_name: string;
    item_sold_by: string;
    item_first_image: string;
    subtotal: number;
    quantity: number;
    price_variant: string;
    date_ordered: string;
    status: string;
}
