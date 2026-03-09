import { supabase } from "@/config/supabaseclient";

/**
 * Checks if a variant's stock is low and sends push/in-app notifications to admins.
 *
 * @param variantId The ID of the variant whose stock changed.
 * @param currentStock Optional current effective stock. If not provided, fetches from DB.
 */
export async function checkLowStockAndNotify(
	variantId: string,
	currentStock?: number,
) {
	try {
		// 1. Fetch variant details including threshold and name
		const { data: variant, error: variantError } = await supabase
			.from("Variant")
			.select(
				"variant_name, variant_low_stock_threshold, Item(item_title)",
			)
			.eq("variant_id", variantId)
			.single();

		if (variantError || !variant) {
			console.error(
				"Error fetching variant for low stock check:",
				variantError,
			);
			return;
		}

		// 2. Fetch current stock if not provided
		let stock = currentStock;
		if (stock === undefined) {
			const { data: movement, error: movementError } = await supabase
				.from("StockMovement")
				.select("effective_stocks")
				.eq("variant_id", variantId)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (movementError) {
				console.error(
					"Error fetching stock for low stock check:",
					movementError,
				);
				return;
			}
			stock = movement?.effective_stocks ?? 0;
		}

		const threshold = variant.variant_low_stock_threshold ?? 0;
		const itemTitle = (variant.Item as any)?.item_title || "Unknown Item";
		const variantName = variant.variant_name;

		// 3. If stock is low, notify admins
		if ((stock ?? 0) <= threshold) {
			// 3a. Fetch all approved admins
			const { data: admins, error: adminsError } = await supabase
				.from("User")
				.select("user_id")
				.eq("user_role", "Admin")
				.eq("user_status", "Approved");

			if (adminsError || !admins) {
				console.error(
					"Error fetching admins for low stock notification:",
					adminsError,
				);
				return;
			}

			if (admins.length === 0) {
				console.log("No admins found to notify for low stock.");
				return;
			}

			const title = "Low Stock Alert";
			const body = `Stock for ${itemTitle} (${variantName}) is low: ${stock} remaining. (Threshold: ${threshold})`;

			// 4. Send notifications to each admin
			const notificationPromises = admins.map(async (admin) => {
				const userId = admin.user_id;

				// A. Push Notification via Edge Function
				const pushPromise = fetch(
					"https://mnitpbgrbldkrhlzmnpy.supabase.co/functions/v1/send-push-notification",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
							Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
						},
						body: JSON.stringify({
							userId,
							title,
							body,
							data: { variantId, currentStock: stock, threshold },
						}),
					},
				).catch((err) =>
					console.error(
						`Error sending push to admin ${userId}:`,
						err,
					),
				);

				// B. In-app Notification
				const dbPromise = supabase.from("Notification").insert({
					user_id: userId,
					title,
					body,
					type: "low_stock",
					data: { variantId, currentStock: stock, threshold },
					is_read: false,
				});
				return Promise.all([pushPromise, dbPromise]);
			});

			await Promise.all(notificationPromises);
			console.log(
				`Low stock notifications sent to ${admins.length} admins.`,
			);
		}
	} catch (err) {
		console.error("Error in checkLowStockAndNotify:", err);
	}
}
