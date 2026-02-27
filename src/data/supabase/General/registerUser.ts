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
		return null;
	}

	const userId = authData.user?.id;
	if (!userId) {
		console.error("No user ID returned from Auth");
		return null;
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

		await supabase.from("User_Valid_Identification").insert({
			user_id: userId,
			valid_id_img_url: publicUrl,
		});
	}

	if (tableError) {
		console.error("Users table insert error:", tableError.message);
		return null;
	}

	await supabase.auth.signOut();
};
