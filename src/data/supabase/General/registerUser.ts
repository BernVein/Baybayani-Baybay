import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";
import imageCompression from "browser-image-compression";

export const registerUser = async (
	profile: UserProfile,
	password: string,
	validId: File[],
) => {
	const compressImage = async (file: File): Promise<File> => {
		const options = {
			maxSizeMB: 0.5,
			maxWidthOrHeight: 1200,
			useWebWorker: true,
			fileType: "image/jpeg",
		};
		try {
			const compressedFile = await imageCompression(file, options);
			return compressedFile;
		} catch (error) {
			console.error("Compression error for file:", file.name, error);
			throw new Error(
				`Failed to process image "${file.name}". It might be corrupted or not a valid image format.`,
			);
		}
	};

	// 1. Process and compress all images FIRST to ensure they are valid
	const processedImages: { file: File; originalName: string }[] = [];
	for (const img of validId) {
		if (!(img instanceof File)) continue;
		const compressed = await compressImage(img);
		processedImages.push({ file: compressed, originalName: img.name });
	}

	// Guard: all uploads were skipped (no valid File objects passed)
	if (processedImages.length === 0) {
		throw new Error(
			"No valid images were provided. Please upload a valid ID image.",
		);
	}

	// 2. Proceed with Auth signup only if images are valid and processed
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email: profile.login_user_name + "@gmail.com",
		password,
	});

	if (authError) {
		console.error("Auth signup error:", authError.message);
		throw new Error(authError.message);
	}

	const userId = authData.user?.id;
	if (!userId) {
		throw new Error("No user ID returned from Auth");
	}

	// 3. Insert user into users table
	const { error: tableError } = await supabase
		.from("User")
		.insert([
			{
				user_id: userId,
				user_name: profile.user_name,
				user_role: profile.user_role,
				user_profile_img_url: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${profile.user_name}`,
				user_theme: "light",
				login_user_name: profile.login_user_name,
				user_phone_number: profile.user_phone_number,
				user_status: "For Approval",
			} as UserProfile,
		])
		.select();

	if (tableError) {
		console.error("Users table insert error:", tableError.message);
		// Rollback: delete the auth user we just created so there's no zombie account.
		// Uses a SECURITY DEFINER Postgres function, no admin key needed on client.
		// Cause the user can only delete its own account
		const { error } = await supabase.rpc("delete_own_auth_user");

		if (error) {
			console.error("Delete failed:", error);
			return;
		}

		await supabase.auth.signOut();
		throw new Error(`Profile creation failed: ${tableError.message}`);
	}

	// 4. ID Upload section - All images are already compressed and validated
	try {
		for (const { file } of processedImages) {
			// Compressed output is always JPEG — use .jpg regardless of original extension
			const fileName = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
			const filePath = `user-id/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("Valid_Identification")
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			const publicUrl = supabase.storage
				.from("Valid_Identification")
				.getPublicUrl(filePath).data.publicUrl;

			const { error: idInsertError } = await supabase
				.from("User_Valid_Identification")
				.insert({
					user_id: userId,
					valid_id_img_url: publicUrl,
				});

			if (idInsertError) throw idInsertError;
		}
	} catch (idError: any) {
		console.error("ID upload/record error:", idError.message);
		throw new Error(
			"Account created, but verification ID upload failed. Please contact support or try uploading in settings.",
		);
	}
};
