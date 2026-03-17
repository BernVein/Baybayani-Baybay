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
		const compressedFile = await imageCompression(file, options);
		return compressedFile;
	};

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

	// Insert user into users table
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
		// Note: We don't delete the auth user here because client-side delete is restricted.
		// The next signup attempt with the same username will likely fail at Auth level anyway.
		throw new Error(`Profile creation failed: ${tableError.message}`);
	}

	// ID Upload section - Separate try block to track if account was created but ID failed
	try {
		for (const img of validId) {
			if (!(img instanceof File)) continue;

			const compressedImage = await compressImage(img);
			const fileExt = img.name.split(".").pop();
			const fileName = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
			const filePath = `user-id/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("Valid_Identification")
				.upload(filePath, compressedImage);

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
		// We throw a specific error so the UI can know the account exists but ID failed
		throw new Error(
			"Account created, but verification ID upload failed. Please contact support or try uploading in settings.",
		);
	}
};
