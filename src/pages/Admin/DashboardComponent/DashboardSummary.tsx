import {
	Card,
	CardBody,
	Divider,
	Link,
	useDisclosure,
	Skeleton,
} from "@heroui/react";

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
import { DashboardStats } from "@/data/supabase/Admin/Dashboard/useDashboardStats";

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

export function DashboardSummary({
	stats,
	loading,
}: {
	stats: DashboardStats | null;
	loading: boolean;
}) {
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
					<span className="text-default-500 font-medium">
						TOTAL REVENUE
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								{loading ? (
									<Skeleton className="h-8 w-24 rounded-lg" />
								) : (
									<>
										<span className="text-2xl sm:text-2xl">
											₱
										</span>
										<span className="text-3xl font-bold">
											{stats?.totalRevenue.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											) ?? "0.00"}
										</span>
									</>
								)}
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70 shrink-0">
								<PesoIcon className="w-4 h-4 text-white" />
							</div>
						</div>
						{loading ? (
							<Skeleton className="h-4 w-32 rounded mt-2" />
						) : (
							<div className="flex flex-row items-baseline gap-1 mt-2">
								<span className="text-default-400">
									Avg. Order Value:
								</span>
								<span className="font-semibold text-default-600">
									₱
									{(
										(stats?.totalRevenue ?? 0) /
											(stats?.totalOrders.completed ||
												1) || 0
									).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
						)}
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md" />
			</Card>

			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500 font-medium">
						TOTAL ORDERS RECEIVED
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								{loading ? (
									<Skeleton className="h-8 w-12 rounded-lg" />
								) : (
									<span className="text-3xl font-bold">
										{(stats?.totalOrders.completed ?? 0) +
											(stats?.totalOrders.cancelled ??
												0) +
											(stats?.totalOrders.pending ?? 0)}
									</span>
								)}

								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<CheckIcon className="w-5" />
									<span>
										{loading ? (
											<Skeleton className="h-4 w-4 rounded" />
										) : (
											(stats?.totalOrders.completed ?? 0)
										)}
									</span>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<ClockIcon className="w-5" />
									<span>
										{loading ? (
											<Skeleton className="h-4 w-4 rounded" />
										) : (
											(stats?.totalOrders.pending ?? 0)
										)}
									</span>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<XIcon className="w-5" />
									<span>
										{loading ? (
											<Skeleton className="h-4 w-4 rounded" />
										) : (
											(stats?.totalOrders.cancelled ?? 0)
										)}
									</span>
								</div>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/70 shrink-0">
								<TotalOrdersIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						{loading ? (
							<Skeleton className="h-4 w-32 rounded mt-2" />
						) : (
							<div className="flex flex-row items-baseline gap-1 mt-2">
								<span className="text-default-400">
									Completion Rate:
								</span>
								<span className="font-semibold text-default-600">
									{(
										((stats?.totalOrders.completed ?? 0) /
											((stats?.totalOrders.completed ??
												0) +
												(stats?.totalOrders.cancelled ??
													0) +
												(stats?.totalOrders.pending ??
													0)) || 0) * 100
									).toFixed(1)}
									%
								</span>
							</div>
						)}
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/70 rounded-t-md" />
			</Card>

			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500 font-medium">
						TOTAL CUSTOMERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								{loading ? (
									<Skeleton className="h-8 w-12 rounded-lg" />
								) : (
									<span className="text-3xl font-bold">
										{(stats?.totalCustomers.individual ??
											0) +
											(stats?.totalCustomers
												.cooperative ?? 0)}
									</span>
								)}
								<div className="text-default-500 flex flex-row items-center gap-1 ml-3">
									<SoloUserIcon className="w-5" />
									<span>
										{loading ? (
											<Skeleton className="h-4 w-4 rounded" />
										) : (
											(stats?.totalCustomers.individual ??
											0)
										)}
									</span>
									<Divider
										className="h-6 m-1"
										orientation="vertical"
									/>
									<UserIcon className="w-5" />
									<span>
										{loading ? (
											<Skeleton className="h-4 w-4 rounded" />
										) : (
											(stats?.totalCustomers
												.cooperative ?? 0)
										)}
									</span>
								</div>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70 shrink-0">
								<UserIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						{loading ? (
							<Skeleton className="h-4 w-24 rounded mt-2" />
						) : (
							<div className="flex flex-row items-baseline gap-1 mt-2">
								<span className="text-default-400">
									New Members:
								</span>
								<span className="font-semibold text-default-600">
									{stats?.newCustomersCount ?? 0} users
								</span>
							</div>
						)}
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md" />
			</Card>

			{/* Store Hours Card */}
			<Card className="w-full">
				<CardBody className="gap-y-2">
					<span className="text-default-500 font-medium">
						STORE HOURS
					</span>
					<div className="flex flex-col gap-y-1">
						{displayedClosed ? (
							<div className="flex flex-row items-center justify-between">
								<span className="text-2xl font-bold italic text-red-400">
									Closed Today
								</span>
								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70 shrink-0">
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
								<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70 shrink-0">
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
