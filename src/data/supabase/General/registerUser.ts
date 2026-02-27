import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";

export const registerUser = async (profile: UserProfile, password: string) => {
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
	await supabase.auth.signOut();
	if (tableError) {
		console.error("Users table insert error:", tableError.message);
		return null;
	}
};
