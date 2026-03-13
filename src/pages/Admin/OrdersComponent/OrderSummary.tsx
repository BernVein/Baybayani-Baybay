import { Card, CardBody, Skeleton } from "@heroui/react";
import { PendingIcon, CheckIcon, XIcon } from "@/components/icons";
import { useOrdersSummary } from "@/data/supabase/Admin/Orders/useOrdersSummary";

export function OrderSummary() {
	const { completed, pending, cancelled, loading } = useOrdersSummary();

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL COMPLETED ORDERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{completed}
									</span>
								</Skeleton>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<CheckIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							Total of finished orders
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL PENDING ORDERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{pending}
									</span>
								</Skeleton>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<PendingIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							Orders waiting for action
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md" />
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL CANCELLED ORDERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<Skeleton
									isLoaded={!loading}
									className="rounded-lg"
								>
									<span className="text-3xl font-bold">
										{cancelled}
									</span>
								</Skeleton>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<XIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							Total cancelled transactions
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md" />
			</Card>
		</div>
	);
}
