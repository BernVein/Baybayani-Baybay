export interface UserProfile {
	user_id: string;
	user_name: string;
	user_theme: "light" | "dark";
	user_login_name: string;
	user_phone_number: string;
	user_fcm_token: string;
	user_role: "Individual" | "Cooperative" | "Admin";
	user_profile_img_url: string;
}
