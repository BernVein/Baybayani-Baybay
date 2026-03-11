import { useClosingTimeContext } from "@/ContextProvider/ClosingTimeContext/ClosingTimeContext";
import { ClockAlert, Lock } from "lucide-react";

export function ClosingTimeBanner() {
	const { isClosed, isNearingClose, closingTime } = useClosingTimeContext();

	if (!isClosed && !isNearingClose) return null;

	const formattedTime = closingTime
		? closingTime.toLocaleTimeString("en-PH", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
		: "";

	if (isClosed) {
		return (
			<div
				className="w-full flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium"
				style={{ backgroundColor: "#dc2626", color: "#fff" }}
			>
				<span>
					<Lock className="w-5" />
				</span>
				<span>
					The store is currently <strong>closed</strong>. You cannot
					add to cart or place orders.
				</span>
			</div>
		);
	}

	// isNearingClose
	return (
		<div
			className="w-full flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium"
			style={{ backgroundColor: "#d97706", color: "#fff" }}
		>
			<span>
				<ClockAlert className="w-5" />
			</span>
			<span>
				Store closes at <strong>{formattedTime}</strong>. Orders will no
				longer be accepted after that.
			</span>
		</div>
	);
}
