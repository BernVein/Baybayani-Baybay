import { Card, CardBody } from "@heroui/react";
import {
	ProductIcon,
	ProductIconWithArrowDown,
	ProductIconWithX,
} from "@/components/icons";

export function ProductSummary() {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">TOTAL ITEMS</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center">
								<span className="text-3xl font-bold">21</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/70">
								<ProductIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							+3 vs last month
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL INVENTORY QUANTITY
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">322</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/70">
								<ProductIconWithArrowDown className="w-6 h-6 text-white" />
							</div>
						</div>
						<span className="text-default-500">
							last item added on Nov 23, 2025
						</span>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/70 rounded-t-md"></div>
			</Card>
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">
						TOTAL ITEMS WITHOUT STOCK
					</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">14</span>
							</div>
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<ProductIconWithX className="w-6 h-6 text-white" />
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
