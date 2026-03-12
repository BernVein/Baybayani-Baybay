import { Card, CardBody, Divider, Link, useDisclosure } from "@heroui/react";

import {
	PesoIcon,
	CheckIcon,
	ClockIcon,
	TotalOrdersIcon,
	UserIcon,
	SoloUserIcon,
	PencilIcon,
	XIcon,
} from "@/components/icons";

import { useEffect, useState } from "react";
import { useClosingTime } from "@/data/supabase/General/useClosingTime";
import { LockIcon, LockOpen } from "lucide-react";
import {
	ChangeStoreHoursModal,
	StoreHoursSnapshot,
} from "@/pages/Admin/DashboardComponent/ChangeStoreHoursModal";

function formatTimeTo12h(timeString: string | null) {
	if (!timeString) return { hour: "--", minute: "--", period: "" };
	const [hour, minute] = timeString.split(":").map(Number);
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 || 12;
	return {
		hour: String(displayHour),
		minute: String(minute).padStart(2, "0"),
		period,
	};
}

export function DashboardSummary() {
	const {
		isOpen: isOpenChangeTime,
		onOpen: onOpenChangeTime,
		onOpenChange: onOpenChangeChangeTime,
		onClose: onCloseChangeTime,
	} = useDisclosure();

	const { rawClosingDate, rawOpeningDate, isClosedForTheDay } =
		useClosingTime();

	// Optimistic override (null means "use hook values")
	const [optimistic, setOptimistic] = useState<StoreHoursSnapshot | null>(
		null,
	);

	// When realtime fires, the hook values are authoritative , clear the override
	useEffect(
		() => setOptimistic(null),
		[rawClosingDate, rawOpeningDate, isClosedForTheDay],
	);

	const displayedClosing = optimistic?.closingDate ?? rawClosingDate;
	const displayedOpening = optimistic?.openingDate ?? rawOpeningDate;
	const displayedClosed = optimistic?.closedForDay ?? isClosedForTheDay;

	const closing12h = formatTimeTo12h(displayedClosing);
	const opening12h = formatTimeTo12h(displayedOpening);

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL REVENUE</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<span className="text-2xl sm:text-2xl">₱</span>
								<span className="text-3xl font-bold">1.00</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<PesoIcon className="w-4 h-4 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+12.5% vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL ORDERS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">32</span>
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<CheckIcon className="w-5" />
									<span className="text-default-500">20</span>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<XIcon className="w-5" />
									<span>12</span>
								</div>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/70">
								<TotalOrdersIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							-4.3% vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL CUSTOMERS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">14</span>
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<SoloUserIcon className="w-5" />
									<span className="text-default-500">10</span>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<UserIcon className="w-5" />
									<span>4</span>
								</div>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<UserIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+3 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md" />
			</Card>

			{/* Store Hours Card */}
			<Card className="w-full">
				<CardBody className="gap-y-2">
					<span className="text-default-500">STORE HOURS</span>
					<div className="flex flex-col gap-y-1">
						{displayedClosed ? (
							<div className="flex flex-row items-center justify-between">
								<span className="text-2xl font-bold italic text-red-400">
									Closed Today
								</span>
								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
									<ClockIcon className="w-6 h-6 text-white" />
								</div>
							</div>
						) : (
							<div className="flex flex-row items-center justify-between">
								<div className="flex flex-col gap-0.5">
									<div className="flex flex-row items-center gap-2">
										<div className="flex flex-row items-center gap-1">
											<LockOpen className="w-5" />
											<span>
												{opening12h.hour}:
												{opening12h.minute}{" "}
												{opening12h.period}
											</span>
											<Divider
												className="h-6 m-1"
												orientation="vertical"
											/>
											<LockIcon className="w-5" />
											<span>
												{closing12h.hour}:
												{closing12h.minute}{" "}
												{closing12h.period}
											</span>
										</div>
									</div>
								</div>
								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
									<ClockIcon className="w-6 h-6 text-white" />
								</div>
							</div>
						)}
						<Link onPress={onOpenChangeTime}>
							<div className="flex flex-row items-center gap-1">
								<PencilIcon className="w-6 text-default-500" />
								<span className="text-lg text-default-500 italic cursor-pointer">
									Edit store hours
								</span>
							</div>
						</Link>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md" />
			</Card>

			<ChangeStoreHoursModal
				isOpenChangeTime={isOpenChangeTime}
				onOpenChangeChangeTime={onOpenChangeChangeTime}
				onClose={onCloseChangeTime}
				onOptimisticUpdate={setOptimistic}
				onRevert={() => setOptimistic(null)}
			/>
		</div>
	);
}
