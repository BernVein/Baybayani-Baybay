import { useClosingTimeContext } from "@/ContextProvider/ClosingTimeContext/ClosingTimeContext";
import { ClockAlert, Lock } from "lucide-react";

function formatRawTime(rawTime: string | null): string {
	if (!rawTime) return "";
	const [h, m] = rawTime.split(":").map(Number);
	const period = h >= 12 ? "PM" : "AM";
	const displayH = h % 12 || 12;
	return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

export function ClosingTimeBanner() {
	const {
		isClosed,
		isNearingClose,
		closingTime,
		isClosedForTheDay,
		rawClosingDate,
		rawOpeningDate,
	} = useClosingTimeContext();

	if (!isClosed && !isNearingClose) return null;

	const formattedClosingTime = closingTime
		? closingTime.toLocaleTimeString("en-PH", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
		: formatRawTime(rawClosingDate);

	const formattedOpeningTime = formatRawTime(rawOpeningDate);

	if (isClosed) {
		// Whole day closed — no opening/closing times shown
		if (isClosedForTheDay) {
			return (
				<div
					className="w-full flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium"
					style={{ backgroundColor: "#dc2626", color: "#fff" }}
				>
					<span>
						<Lock className="w-5" />
					</span>
					<span>
						The store is <strong>closed today</strong>. Orders are
						not being accepted.
					</span>
				</div>
			);
		}

		// Closed because current time passed closing time — show closing + opening time
		return (
			<div
				className="w-full flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium"
				style={{ backgroundColor: "#dc2626", color: "#fff" }}
			>
				<span>
					<Lock className="w-5" />
				</span>
				<span>
					The store closed at <strong>{formattedClosingTime}</strong>.
					{formattedOpeningTime && (
						<>
							{" "}
							Opens again at{" "}
							<strong>{formattedOpeningTime}</strong>.
						</>
					)}{" "}
					You cannot add to cart or place orders.
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
				Store closes at <strong>{formattedClosingTime}</strong>. Orders
				will no longer be accepted after that.
			</span>
		</div>
	);
}
