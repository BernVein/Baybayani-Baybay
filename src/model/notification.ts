export interface Notification {
	notification_id: string;
	user_id: string;
	title: string;
	body: string;
	is_read: boolean;
	type?: "order_ready" | "order_cancelled" | "chat_message" | string;
	data?: any;
	created_at: string;
}
