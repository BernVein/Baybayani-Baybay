import { Card, CardBody } from "@heroui/react";
import { PendingIcon, CheckIcon, XIcon } from "@/components/icons";

export function OrderSummary() {
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
								<span className="text-3xl font-bold">231</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<CheckIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+12.5% vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL PENDING ORDERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">32</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<PendingIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							5 customers waiting
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL CANCELLED ORDERS
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">14</span>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<XIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+3 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md"></div>
			</Card>
		</div>
	);
}
