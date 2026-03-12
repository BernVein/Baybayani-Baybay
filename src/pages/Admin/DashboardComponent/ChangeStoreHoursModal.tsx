import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	TimeInput,
	Switch,
	addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Time } from "@internationalized/date";
import { updateClosingTime } from "@/data/supabase/Admin/Dashboard/updateClosingTime";
import { useClosingTime } from "@/data/supabase/General/useClosingTime";

function supabaseTimeToTimeObject(timeString: string): Time {
	const [hour, minute, second] = timeString.split(":").map(Number);
	return new Time(hour, minute, second);
}

function timeObjectToSupabase(time: Time): string {
	const h = String(time.hour).padStart(2, "0");
	const m = String(time.minute).padStart(2, "0");
	const s = String(time.second ?? 0).padStart(2, "0");
	return `${h}:${m}:${s}`;
}

export interface StoreHoursSnapshot {
	closingDate: string;
	openingDate: string;
	closedForDay: boolean;
}

interface Props {
	isOpenChangeTime: boolean;
	onOpenChangeChangeTime: (isOpen: boolean) => void;
	onClose: () => void;
	/** Called immediately before the DB update — lets the parent update its display optimistically */
	onOptimisticUpdate: (snapshot: StoreHoursSnapshot) => void;
	/** Called on DB failure — lets the parent revert to the previous snapshot */
	onRevert: (snapshot: StoreHoursSnapshot) => void;
}

export function ChangeStoreHoursModal({
	isOpenChangeTime,
	onOpenChangeChangeTime,
	onClose,
	onOptimisticUpdate,
	onRevert,
}: Props) {
	const { rawClosingDate, rawOpeningDate, isClosedForTheDay } =
		useClosingTime();

	const [closingTime, setClosingTime] = useState<Time | null>(null);
	const [openingTime, setOpeningTime] = useState<Time | null>(null);
	const [closedForDay, setClosedForDay] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		if (rawClosingDate)
			setClosingTime(supabaseTimeToTimeObject(rawClosingDate));
	}, [rawClosingDate]);

	useEffect(() => {
		if (rawOpeningDate)
			setOpeningTime(supabaseTimeToTimeObject(rawOpeningDate));
	}, [rawOpeningDate]);

	useEffect(() => {
		setClosedForDay(isClosedForTheDay);
	}, [isClosedForTheDay]);

	const handleSave = async () => {
		if (!closingTime || !openingTime) return;

		const newClosingStr = timeObjectToSupabase(closingTime);
		const newOpeningStr = timeObjectToSupabase(openingTime);

		// Capture current values for potential revert
		const previousSnapshot: StoreHoursSnapshot = {
			closingDate: rawClosingDate ?? newClosingStr,
			openingDate: rawOpeningDate ?? newOpeningStr,
			closedForDay: isClosedForTheDay,
		};

		// Optimistic — update card immediately
		onOptimisticUpdate({
			closingDate: newClosingStr,
			openingDate: newOpeningStr,
			closedForDay,
		});

		setIsUpdating(true);
		const { success } = await updateClosingTime(
			newClosingStr,
			newOpeningStr,
			closedForDay,
		);
		setIsUpdating(false);

		if (success) {
			addToast({
				title: "Success",
				description: "Store hours updated successfully",
				severity: "success",
				timeout: 5000,
				color: "success",
				shouldShowTimeoutProgress: true,
			});
			onClose();
		} else {
			// Revert card to previous values
			onRevert(previousSnapshot);
			addToast({
				title: "Error",
				description: "Something went wrong updating store hours",
				severity: "danger",
				timeout: 5000,
				color: "danger",
				shouldShowTimeoutProgress: true,
			});
		}
	};

	return (
		<Modal
			isOpen={isOpenChangeTime}
			onOpenChange={onOpenChangeChangeTime}
			disableAnimation
			backdrop="blur"
		>
			<ModalContent>
				{(modalOnClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Edit Store Hours
						</ModalHeader>
						<ModalBody className="gap-4">
							<TimeInput
								label="Opening Time"
								value={openingTime}
								onChange={setOpeningTime}
								isDisabled={closedForDay}
							/>
							<TimeInput
								label="Closing Time"
								value={closingTime}
								onChange={setClosingTime}
								isDisabled={closedForDay}
							/>
							<Switch
								isSelected={closedForDay}
								onValueChange={setClosedForDay}
								color="danger"
							>
								<span className="text-sm">
									Closed for the day
								</span>
							</Switch>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={modalOnClose}
							>
								Cancel
							</Button>
							<Button
								color="success"
								onPress={handleSave}
								isLoading={isUpdating}
							>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
