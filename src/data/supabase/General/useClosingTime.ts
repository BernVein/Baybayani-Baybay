import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";
import { ClosingTime } from "@/model/closingTime";

interface ClosingTimeState {
	closingTime: Date | null;
	isClosed: boolean;
	isNearingClose: boolean; // within 2 hours but not yet closed
	loading: boolean;
	rawClosingDate: string | null;
	rawOpeningDate: string | null;
	isClosedForTheDay: boolean;
}

function parseClosingTimeToday(timeStr: string): Date {
	// timeStr is "HH:MM:SS" from Postgres `time` column
	const [hours, minutes, seconds] = timeStr.split(":").map(Number);
	const now = new Date();
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hours,
		minutes,
		seconds ?? 0,
	);
}

function computeState(
	closingDate: Date | null,
	isClosedForTheDay: boolean,
): {
	isClosed: boolean;
	isNearingClose: boolean;
} {
	// If admin explicitly closed the store for the whole day, override everything
	if (isClosedForTheDay) return { isClosed: true, isNearingClose: false };
	if (!closingDate) return { isClosed: false, isNearingClose: false };

	const now = new Date();
	const diffMs = closingDate.getTime() - now.getTime();
	const twoHoursMs = 2 * 60 * 60 * 1000;

	const isClosed = diffMs <= 0;
	const isNearingClose = !isClosed && diffMs <= twoHoursMs;

	return { isClosed, isNearingClose };
}

export function useClosingTime(): ClosingTimeState {
	const [closingDate, setClosingDate] = useState<Date | null>(null);
	const [loading, setLoading] = useState(true);
	const [{ isClosed, isNearingClose }, setComputedState] = useState({
		isClosed: false,
		isNearingClose: false,
	});
	const [rawClosingDate, setRawClosingDate] = useState<string | null>(null);
	const [rawOpeningDate, setRawOpeningDate] = useState<string | null>(null);
	const [isClosedForTheDay, setIsClosedForTheDay] = useState(false);

	const fetchClosingTime = useCallback(async () => {
		const { data, error } = await supabase
			.from("ClosingTime")
			.select("*")
			.maybeSingle();

		if (!error && data) {
			const row = data as ClosingTime;
			const parsed = parseClosingTimeToday(row.closing_time);
			const closedForDay = row.is_closed_for_the_day ?? false;
			setClosingDate(parsed);
			setIsClosedForTheDay(closedForDay);
			setComputedState(computeState(parsed, closedForDay));
			setRawClosingDate(row.closing_time);
			setRawOpeningDate(row.opening_time ?? null);
		}
		setLoading(false);
	}, []);

	// Initial fetch
	useEffect(() => {
		fetchClosingTime();
	}, [fetchClosingTime]);

	// Re-evaluate every 30 seconds so the banner appears / disappears automatically
	useEffect(() => {
		if (!closingDate) return;

		const interval = setInterval(() => {
			setComputedState(computeState(closingDate, isClosedForTheDay));
		}, 30_000);

		return () => clearInterval(interval);
	}, [closingDate, isClosedForTheDay]);

	// Realtime subscription — when admin changes closing time, update immediately
	useEffect(() => {
		const channel = supabase
			.channel("closing-time-changes")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "ClosingTime" },
				(payload) => {
					const row = payload.new as ClosingTime;
					if (row?.closing_time) {
						const parsed = parseClosingTimeToday(row.closing_time);
						const closedForDay = row.is_closed_for_the_day ?? false;
						setClosingDate(parsed);
						setIsClosedForTheDay(closedForDay);
						setComputedState(computeState(parsed, closedForDay));
						setRawClosingDate(row.closing_time);
						setRawOpeningDate(row.opening_time ?? null);
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	return {
		closingTime: closingDate,
		isClosed,
		isNearingClose,
		loading,
		rawClosingDate,
		rawOpeningDate,
		isClosedForTheDay,
	};
}
