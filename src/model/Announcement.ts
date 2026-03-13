export interface Announcement {
	announcement_id: string;
	created_at: string;
	announcement_title: string;
	announcement_body: string;
	images?: AnnouncementImage[];
}

export interface AnnouncementImage {
	announcement_image_id: string;
	announcement_id: string;
	announcement_img_url: string;
}
