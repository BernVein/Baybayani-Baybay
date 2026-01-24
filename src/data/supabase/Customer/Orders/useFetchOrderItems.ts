import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { OrderItemUser } from "@/model/orderItemUser";
import { Item } from "@/model/Item";
import { VariantSnapshot } from "@/model/variantSnapshot";
import { Variant } from "@/model/variant";

export const useFetchOrderItems = (userId?: string) => {
    const [data, setData] = useState<OrderItemUser[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const { data: rawData, error: fetchError } = await supabase
                .from("OrderItemUser")
                .select(
                    `*, Item(*, Item_Image(item_image_url), Variant(*)), VariantSnapshot(*) `,
                )
                .eq("user_id", userId)
                .eq("is_soft_deleted", false);

            if (fetchError) {
                setError(fetchError);
                return;
            }
            console.log("From DB:", rawData);
            const mapped: OrderItemUser[] = (rawData ?? []).map(
                (order: any) => {
                    const item: Item = order.Item
                        ? {
                              item_id: order.Item.item_id,
                              item_category: String(
                                  order.Item.item_category || "",
                              ),
                              item_title: order.Item.item_title,
                              item_img:
                                  order.Item.Item_Image?.map(
                                      (img: any) => img.item_image_url,
                                  ) ?? [],
                              item_sold_by: order.Item.item_sold_by,
                              item_description: order.Item.item_description,
                              item_tag: order.Item.item_tag ?? null,
                              item_has_variant: order.Item.item_has_variant,
                              is_soft_deleted: order.Item.is_soft_deleted,
                              last_updated: order.Item.last_updated,
                              created_at: String(order.Item.created_at || ""),
                              item_variants:
                                  order.Item?.Variant?.map((v: Variant) => ({
                                      variant_id: v.variant_id,
                                      variant_name: v.variant_name,
                                      variant_price_retail: Number(
                                          v.variant_price_retail,
                                      ),
                                      variant_price_wholesale:
                                          v.variant_price_wholesale ?? null,
                                      variant_wholesale_item:
                                          v.variant_wholesale_item ?? null,
                                      variant_stocks: Number(
                                          v.variant_stocks ?? 0,
                                      ),
                                      variant_last_updated_stock:
                                          v.variant_last_updated_stock ?? "",
                                      variant_last_updated_price_retail:
                                          v.variant_last_updated_price_retail ??
                                          null,
                                      variant_last_price_retail:
                                          v.variant_last_price_retail ??
                                          undefined,
                                      variant_last_updated_price_wholesale:
                                          v.variant_last_updated_price_wholesale ??
                                          null,
                                      variant_last_price_wholesale:
                                          v.variant_last_price_wholesale ??
                                          null,
                                      last_updated: v.last_updated ?? "",
                                      is_soft_deleted:
                                          v.is_soft_deleted ?? false,
                                      created_at: v.created_at ?? "",
                                  })) ?? [],
                          }
                        : {
                              item_id: "",
                              item_category: "",
                              item_title: "",
                              item_img: [],
                              item_sold_by: "",
                              item_description: "",
                              item_tag: null,
                              item_has_variant: false,
                              is_soft_deleted: false,
                              last_updated: "",
                              created_at: "",
                              item_variants: [],
                          };

                    const variant_snapshot: VariantSnapshot =
                        order.VariantSnapshot
                            ? {
                                  variant_snapshot_id:
                                      order.VariantSnapshot.variant_snapshot_id,
                                  variant_copy_snapshot_id:
                                      order.VariantSnapshot
                                          .variant_copy_snapshot_id,
                                  variant_snapshot_name:
                                      order.VariantSnapshot
                                          .variant_snapshot_name,
                                  variant_snapshot_price_retail: Number(
                                      order.VariantSnapshot
                                          .variant_snapshot_price_retail,
                                  ),
                                  variant_snapshot_price_wholesale:
                                      order.VariantSnapshot
                                          .variant_snapshot_price_wholesale !=
                                      null
                                          ? Number(
                                                order.VariantSnapshot
                                                    .variant_snapshot_price_wholesale,
                                            )
                                          : null,
                                  variant_snapshot_wholesale_item:
                                      order.VariantSnapshot
                                          .variant_snapshot_wholesale_item !=
                                      null
                                          ? Number(
                                                order.VariantSnapshot
                                                    .variant_snapshot_wholesale_item,
                                            )
                                          : null,
                                  last_updated:
                                      order.VariantSnapshot.last_updated ?? "",
                                  is_soft_deleted:
                                      order.VariantSnapshot.is_soft_deleted ??
                                      false,
                                  created_at:
                                      order.VariantSnapshot.created_at ?? "",
                              }
                            : {
                                  variant_snapshot_id: "",
                                  variant_copy_snapshot_id: "",
                                  variant_snapshot_name: "",
                                  variant_snapshot_price_retail: 0,
                                  variant_snapshot_price_wholesale: null,
                                  variant_snapshot_wholesale_item: null,
                                  last_updated: "",
                                  is_soft_deleted: false,
                                  created_at: "",
                              };

                    return {
                        order_item_user_id: order.order_item_user_id,
                        item,
                        status: order.status,
                        variant_snapshot,
                        price_variant: order.price_variant,
                        quantity: order.quantity,
                        subtotal: order.subtotal,
                        is_soft_deleted: order.is_soft_deleted,
                        created_at: order.created_at ?? "",
                        updated_at: order.updated_at ?? "",
                    };
                },
            );

            setData(mapped);
        };

        fetchData();
    }, [userId]);

    return { data, error };
};
