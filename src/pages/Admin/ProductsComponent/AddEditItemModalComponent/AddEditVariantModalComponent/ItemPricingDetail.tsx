import { Input } from "@heroui/react";

import { Variant } from "@/model/variant";

export function ItemPricingDetail({
	variant,
	setVariant,
	isSubmitted,
}: {
	variant: Variant;
	setVariant: React.Dispatch<React.SetStateAction<Variant>>;
	isSubmitted: boolean;
}) {
	return (
		<>
			<div className="flex flex-row gap-2 items-center">
				<Input
					isRequired
					className="w-1/2"
					description="Starting price"
					errorMessage="Retail price is required"
					inputMode="decimal"
					isInvalid={
						isSubmitted &&
						(variant.variant_price_retail == null ||
							variant.variant_price_retail <= 0)
					}
					label="Retail Price"
					startContent={
						<div className="pointer-events-none flex items-center">
							<span className="text-default-400 text-small">
								₱
							</span>
						</div>
					}
					type="text"
					value={
						variant.variant_price_retail !== undefined
							? String(variant.variant_price_retail)
							: ""
					}
					onValueChange={(v) => {
						if (v === "") {
							setVariant({
								...variant,
								variant_price_retail: undefined,
							});

							return;
						}

						const num = Number(v);

						if (Number.isNaN(num)) return;

						setVariant({
							...variant,
							variant_price_retail: num,
						});
					}}
				/>

				<Input
					className="w-1/2"
					description="For bulk purchase"
					inputMode="decimal"
					label="Wholesale Price"
					startContent={
						<div className="pointer-events-none flex items-center">
							<span className="text-default-400 text-small">
								₱
							</span>
						</div>
					}
					type="text"
					value={
						variant.variant_price_wholesale !== undefined ||
						variant.variant_price_wholesale === null
							? String(variant.variant_price_wholesale)
							: ""
					}
					onValueChange={(v) => {
						if (v === "") {
							setVariant({
								...variant,
								variant_price_wholesale: undefined,
							});

							return;
						}

						const num = Number(v);

						if (Number.isNaN(num) || num <= 0) return;

						setVariant({
							...variant,
							variant_price_wholesale: num,
						});
					}}
				/>
			</div>
		</>
	);
}
