import { Skeleton, Divider } from "@heroui/react";

export function AddEditItemModalSkeleton({
	itemHasVariant,
}: {
	itemHasVariant: boolean;
}) {
	return (
		<div className="flex flex-col gap-4">
			{/* Item Details Skeleton */}
			<div className="flex flex-col gap-3 mt-4">
				<div className="flex w-full gap-3">
					<Skeleton className="h-13 w-1/2 rounded-lg" />
					<Skeleton className="h-13 w-1/2 rounded-lg" />
				</div>

				<Skeleton className="h-13 w-full rounded-lg" />

				<div className="flex w-full gap-3">
					<Skeleton className="h-13 w-1/2 rounded-lg" />
					<Skeleton className="h-13 w-1/2 rounded-lg" />
				</div>
			</div>

			{/* Photo Button Skeleton */}
			<Skeleton className="h-12 w-full mt-2 rounded-lg" />
			{itemHasVariant && (
				/* Variant List Skeleton */
				<div className="flex flex-col gap-3 pr-2">
					{Array.from({ length: 2 }).map((_, index) => (
						<div key={index}>
							{/* Card Header Skeleton */}
							<div className="flex justify-between items-start p-3">
								<div className="flex flex-col gap-1 w-full">
									<Skeleton className="h-5 w-1/3 rounded-sm" />
									<Skeleton className="h-3 w-1/4 rounded-sm" />
								</div>
								<div className="flex gap-2 ml-auto">
									<Skeleton className="h-8 w-8 rounded-sm" />
									<Skeleton className="h-8 w-8 rounded-sm" />
								</div>
							</div>

							<Divider />

							{/* Card Body Skeleton */}
							<div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
								<Skeleton className="h-4 w-full rounded-sm" />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
