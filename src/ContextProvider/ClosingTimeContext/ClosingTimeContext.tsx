import { createContext, useContext, ReactNode } from "react";
import { useClosingTime } from "@/data/supabase/General/useClosingTime";

interface ClosingTimeContextValue {
	closingTime: Date | null;
	isClosed: boolean;
	isNearingClose: boolean;
	loading: boolean;
	isClosedForTheDay: boolean;
	rawClosingDate: string | null;
}

const ClosingTimeContext = createContext<ClosingTimeContextValue>({
	closingTime: null,
	isClosed: false,
	isNearingClose: false,
	loading: true,
	isClosedForTheDay: false,
	rawClosingDate: null,
});

export function ClosingTimeProvider({ children }: { children: ReactNode }) {
	const value = useClosingTime();
	return (
		<ClosingTimeContext.Provider value={value}>
			{children}
		</ClosingTimeContext.Provider>
	);
}

export function useClosingTimeContext(): ClosingTimeContextValue {
	return useContext(ClosingTimeContext);
}
