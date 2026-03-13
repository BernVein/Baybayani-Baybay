import { supabase } from "@/config/supabaseclient";
import imageCompression from "browser-image-compression";

export async function addAnnouncement(
	title: string,
	body: string,
	images: File[],
) {
	const compressImage = async (file: File): Promise<File> => {
		const options = {
			maxSizeMB: 0.5,
			maxWidthOrHeight: 1200,
			useWebWorker: true,
			fileType: "image/jpeg",
		};
		const compressedFile = await imageCompression(file, options);
		return compressedFile;
	};

	try {
		// 1. Insert Announcement
		const { data: newAnnouncement, error: announcementError } =
			await supabase
				.from("Announcement")
				.insert({
					announcement_title: title,
					announcement_body: body,
				})
				.select("*")
				.single();

		if (announcementError || !newAnnouncement) {
			throw (
				announcementError || new Error("Failed to insert Announcement")
			);
		}

		const announcementId = newAnnouncement.announcement_id;

		// 2. Upload Images
		const imageUrls: string[] = [];
		for (const img of images) {
			const compressedImage = await compressImage(img);
			const fileExt = img.name.split(".").pop();
			const fileName = `announcement-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
			const filePath = `announcements/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("Announcement_Image")
				.upload(filePath, compressedImage);

			if (uploadError) throw uploadError;

			const publicUrl = supabase.storage
				.from("Announcement_Image")
				.getPublicUrl(filePath).data.publicUrl;

			const { error: imgInsertError } = await supabase
				.from("Announcement_Image")
				.insert({
					announcement_id: announcementId,
					announcement_img_url: publicUrl,
				});

			if (imgInsertError) throw imgInsertError;
			imageUrls.push(publicUrl);
		}

		// 3. Notify all users
		// Fetch all users (non-soft-deleted, approved)
		const { data: users, error: usersError } = await supabase
			.from("User")
			.select("user_id")
			.eq("user_status", "Approved")
			.eq("is_soft_deleted", false);

		if (!usersError && users) {
			const notificationPromises = users.map(async (user) => {
				const userId = user.user_id;

				// In-app Notification
				const dbPromise = supabase.from("Notification").insert({
					user_id: userId,
					title: title,
					body: body,
					type: "announcement",
					data: { announcementId },
					is_read: false,
				});

				// Push Notification via Edge Function
				const pushPromise = supabase.functions.invoke(
					"send-push-notification",
					{
						body: {
							userId,
							title: title,
							body: body,
							data: {
								announcementId: String(announcementId),
								type: "announcement",
							},
						},
					},
				);

				return Promise.all([dbPromise, pushPromise]);
			});

			// We don't want to block the return on all notifications being sent if there are many users,
			// but for now, we'll await them to ensure they are triggered.
			// If user count is very high, this should be offloaded to a background task/edge function.
			await Promise.allSettled(notificationPromises);
		}

		return { success: true, announcementId };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : JSON.stringify(error);
		console.error("Error in addAnnouncement:", error);
		return { success: false, error: message };
	}
}
