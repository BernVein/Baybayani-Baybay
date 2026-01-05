import { Order } from "@/model/order";

export const ordersMockData: Order[] = [
	{
		order_id: "order-001",
		status: "Processing",
		created_at: "2026-01-05T08:15:00Z",
		total_price: 1500,
		items: [
			{
				order_item_user_id: "order-item-001",
				item: {
					item_id: "item-001",
					item_category: "Electronics",
					item_title: "Wireless Mouse",
					item_img: [
						"https://example.com/mouse1.png",
						"https://example.com/mouse2.png",
					],
					item_sold_by: "TechStorePH",
					item_description:
						"Ergonomic wireless mouse with adjustable DPI.",
					item_tag: "New",
					is_soft_deleted: false,
					last_updated: "2026-01-04T12:00:00Z",
					created_at: "2026-01-01T09:00:00Z",
					item_variants: [],
				},
				variant_snapshot: {
					variant_snapshot_id: "vs-001",
					variant_copy_snapshot_id: "variant-001",
					variant_snapshot_name: "Black",
					variant_snapshot_price_retail: 750,
					variant_snapshot_price_wholesale: null,
					variant_snapshot_wholesale_item: null,
					last_updated: "2026-01-05T08:14:00Z",
					is_soft_deleted: false,
					created_at: "2026-01-05T08:14:00Z",
				},
				price_variant: "750",
				quantity: 2,
				subtotal: 1500,
				is_soft_deleted: false,
				created_at: "2026-01-05T08:14:00Z",
				updated_at: "2026-01-05T08:14:00Z",
			},
		],
	},

	{
		order_id: "order-002",
		status: "Delivered",
		created_at: "2025-12-28T10:30:00Z",
		total_price: 980,
		items: [
			{
				order_item_user_id: "order-item-002",
				item: {
					item_id: "item-002",
					item_category: "Groceries",
					item_title: "Premium Rice 5kg",
					item_img: ["https://example.com/rice.png"],
					item_sold_by: "Baybayani",
					item_description:
						"Locally sourced premium rice from Leyte farmers.",
					item_tag: "Restocked",
					is_soft_deleted: false,
					last_updated: "2025-12-27T09:00:00Z",
					created_at: "2025-12-01T08:00:00Z",
					item_variants: [],
				},
				variant_snapshot: {
					variant_snapshot_id: "vs-002",
					variant_copy_snapshot_id: "variant-005",
					variant_snapshot_name: "5kg Sack",
					variant_snapshot_price_retail: 490,
					variant_snapshot_price_wholesale: 450,
					variant_snapshot_wholesale_item: 10,
					last_updated: "2025-12-28T10:29:00Z",
					is_soft_deleted: false,
					created_at: "2025-12-28T10:29:00Z",
				},
				price_variant: "490",
				quantity: 2,
				subtotal: 980,
				is_soft_deleted: false,
				created_at: "2025-12-28T10:29:00Z",
				updated_at: "2025-12-28T10:29:00Z",
			},
		],
	},
];
