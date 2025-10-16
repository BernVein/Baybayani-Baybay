import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { Item } from "@/model/Item";

export default function ItemInfoModal({
	isOpen,
	onOpenChange,
	item,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	item: Item;
}) {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{item.title}
						</ModalHeader>
						<ModalBody>
							<p>
								{item.description ||
									"No description available."}
							</p>
							<p>Category: {item.category}</p>
							<p>Price: ₱{item.price.toFixed(2)}</p>
							<p>Stocks: {item.stocks}</p>
							<p>Sold by: {item.soldBy}</p>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
