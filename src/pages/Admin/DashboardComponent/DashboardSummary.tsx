import {
	Card,
	CardBody,
	Divider,
	Link,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Button,
	TimeInput,
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
import { Time } from "@internationalized/date";
export function DashboardSummary() {
	const {
		isOpen: isOpenChangeTime,
		onOpen: onOpenChangeTime,
		onOpenChange: onOpenChangeChangeTime,
	} = useDisclosure();
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
			<Card className="w-full">
				<CardBody className="gap-y-3">
					<span className="text-default-500">CLOSING TIME</span>
					<div className="flex flex-col item-center">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<span className="text-3xl font-bold">5:00</span>
								<span>PM</span>
							</div>

							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/70">
								<ClockIcon className="w-6 h-6 text-white" />
							</div>
						</div>
						<Link onPress={onOpenChangeTime}>
							<div className="flex flex-row items-center gap-1">
								<PencilIcon className="w-5 text-default-500" />
								<span className="text-default-500 italic cursor-pointer">
									Edit closing time
								</span>
							</div>
						</Link>
					</div>
				</CardBody>
				<div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/70 rounded-t-md" />
			</Card>
			<Modal
				isOpen={isOpenChangeTime}
				onOpenChange={onOpenChangeChangeTime}
				disableAnimation
				backdrop="blur"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Edit Closing Time
							</ModalHeader>
							<ModalBody>
								<TimeInput
									defaultValue={new Time(11, 45)}
									label="Event Time"
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
								<Button color="success" onPress={onClose}>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
