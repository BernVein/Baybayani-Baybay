export interface UserProfile {
	user_id?: string | null;
	user_name: string;
	user_theme: "light" | "dark";
	login_user_name: string;
	user_phone_number: string;
	user_role: "Individual" | "Cooperative" | "Admin";
	user_profile_img_url: string;
	user_status: "For Approval" | "Approved" | "Rejected" | "Suspended";
	user_valid_id_img_url?: string[] | null;
	created_at?: string | null;
}
