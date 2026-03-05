import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
} from "@heroui/react";

export function OrderTableSkeleton() {
	return (
		<div>
			{/* --- MOBILE SKELETON --- */}
			<div className="sm:hidden">
				<Table className="w-full">
					<TableHeader>
						<TableColumn>CUSTOMER & ORDER ID</TableColumn>
						<TableColumn>ORDER INFO</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-40 rounded-md" />
										<Skeleton className="h-3 w-28 rounded-md" />
										<Skeleton className="h-3 w-24 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-3 w-20 rounded-md" />
										<Skeleton className="h-4 w-24 rounded-md" />
										<Skeleton className="h-3 w-28 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-8 rounded-md" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* --- DESKTOP SKELETON --- */}
			<div className="sm:flex hidden">
				<Table className="w-full">
					<TableHeader>
						<TableColumn>CUSTOMER</TableColumn>
						<TableColumn>DATE & ORDER ID</TableColumn>
						<TableColumn>ITEM</TableColumn>
						<TableColumn>QUANTITY</TableColumn>
						<TableColumn>SUBTOTAL</TableColumn>
						<TableColumn>STATUS</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i}>
								{/* CUSTOMER CELL */}
								<TableCell>
									<div className="flex items-center gap-2">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div className="flex flex-col gap-2">
											<Skeleton className="h-4 w-40 rounded-md" />
											<Skeleton className="h-3 w-24 rounded-md" />
										</div>
									</div>
								</TableCell>

								{/* DATE CELL */}
								<TableCell>
									<Skeleton className="h-4 w-24 rounded-md" />
								</TableCell>

								{/* ITEM CELL */}
								<TableCell>
									<Skeleton className="h-4 w-24 rounded-md" />
								</TableCell>

								{/* QUANTITY CELL */}
								<TableCell>
									<Skeleton className="h-4 w-24 rounded-md" />
								</TableCell>

								{/* SUBTOTAL CELL */}
								<TableCell>
									<Skeleton className="h-4 w-24 rounded-md" />
								</TableCell>

								{/* STATUS CELL */}
								<TableCell>
									<Skeleton className="h-4 w-24 rounded-md" />
								</TableCell>

								{/* ACTIONS CELL */}
								<TableCell>
									<Skeleton className="h-8 w-8 rounded-md" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
