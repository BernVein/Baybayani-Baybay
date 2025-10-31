import { Variant } from "@/model/variant";
import { Button } from "@heroui/react";
import { CartIcon } from "@/components/icons";
export default function Footer({
	selectedItemVariant,
	selectedPriceVariant,
	rawQuantity,
	actualQuantity,
	onClose,
}: {
	selectedItemVariant: Variant | null;
	selectedPriceVariant: string;
	rawQuantity: number;
	actualQuantity: number;
	onClose: () => void;
}) {
	return (
		<>
			<div className="flex flex-col gap-2 items-start">
				<span className="text-sm text-default-500">
					Subtotal ({selectedPriceVariant}):
				</span>
				<div className="flex flex-row gap-2 items-center">
					<span className="text-base font-semibold">
						{rawQuantity
							? `₱${(selectedPriceVariant === "Wholesale"
									? (selectedItemVariant?.variant_price_wholesale ??
											1) * actualQuantity
									: (selectedItemVariant?.variant_price_retail ??
											0) * rawQuantity
								).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}`
							: "Enter quantity"}
					</span>
				</div>
			</div>
			<div className="flex gap-2">
				<Button color="danger" variant="light" onPress={onClose}>
					Close
				</Button>
				<Button
					color="success"
					startContent={<CartIcon className="size-5" />}
				>
					Update Cart Item
				</Button>
			</div>
		</>
	);
}
