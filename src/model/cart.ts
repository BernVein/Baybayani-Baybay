import { CartItemUser } from "@/model/cartItemUser";

export interface Cart {
  cart_id: string;
  user_id: string;
  items: CartItemUser[];
  is_soft_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface User{
  user_id: string;
  user_name: string:
  user_theme: "light" | "dark"
  user_email: string;
  user_role: "Individual" | "Cooperative" | "Admin";
}
