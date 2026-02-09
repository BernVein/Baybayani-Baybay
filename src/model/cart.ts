import { CartItemUser } from "@/model/cartItemUser";

export interface Cart {
  cart_id: string;
  user_id: string;
  items: CartItemUser[];
  is_soft_deleted: boolean;
  created_at: string;
  updated_at: string;
}
