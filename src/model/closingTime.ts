export interface ClosingTime {
	closing_time_id: string;
	closing_time: string; // "HH:MM:SS" (time column from Postgres)
	updated_at: string;
}
