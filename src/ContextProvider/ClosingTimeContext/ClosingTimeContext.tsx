import { createContext, useContext, ReactNode, useMemo } from "react";
import { useClosingTime } from "@/data/supabase/General/useClosingTime";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

interface ClosingTimeContextValue {
	closingTime: Date | null;
	isClosed: boolean;
	isNearingClose: boolean;
	loading: boolean;
	isClosedForTheDay: boolean;
	rawClosingDate: string | null;
	rawOpeningDate: string | null;
	isExempt: boolean;
	realIsClosed: boolean;
	realIsNearingClose: boolean;
}

const ClosingTimeContext = createContext<ClosingTimeContextValue>({
	closingTime: null,
	isClosed: false,
	isNearingClose: false,
	loading: true,
	isClosedForTheDay: false,
	rawClosingDate: null,
	rawOpeningDate: null,
	isExempt: false,
	realIsClosed: false,
	realIsNearingClose: false,
});

export function ClosingTimeProvider({ children }: { children: ReactNode }) {
	const closingTimeState = useClosingTime();
	const auth = useAuth();

	const isExempt = auth?.profile?.user_role === "Cooperative";

	const value = useMemo(() => {
		return {
			...closingTimeState,
			isExempt,
			// If exempt, they never see the store as closed/nearing close
			isClosed: isExempt ? false : closingTimeState.isClosed,
			isNearingClose: isExempt ? false : closingTimeState.isNearingClose,
			// Keep actual states for banner or other uses
			realIsClosed: closingTimeState.isClosed,
			realIsNearingClose: closingTimeState.isNearingClose,
		};
	}, [closingTimeState, isExempt]);

	return (
		<ClosingTimeContext.Provider value={value}>
			{children}
		</ClosingTimeContext.Provider>
	);
}

export function useClosingTimeContext(): ClosingTimeContextValue {
	return useContext(ClosingTimeContext);
}
