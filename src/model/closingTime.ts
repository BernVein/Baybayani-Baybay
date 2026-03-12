export interface ClosingTime {
	closing_time_id: string;
	closing_time: string; // "HH:MM:SS" (time column from Postgres)
	opening_time: string; // "HH:MM:SS"
	is_closed_for_the_day: boolean;
	updated_at: string;
}
