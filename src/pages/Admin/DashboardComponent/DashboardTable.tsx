import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Avatar,
	Skeleton,
} from "@heroui/react";

interface DashboardTableProps {
	data?: {
		name: string;
		value: string;
		image?: string;
	}[];
	loading: boolean;
	emptyContent?: string;
	headers?: [string, string];
}

export function DashboardTable({
	data,
	loading,
	emptyContent = "No data available.",
	headers = ["ITEM", "QUANTITY"],
}: DashboardTableProps) {
	if (loading) {
		return (
			<Table isHeaderSticky removeWrapper className="overflow-y-auto">
				<TableHeader>
					<TableColumn>{headers[0]}</TableColumn>
					<TableColumn>{headers[1]}</TableColumn>
				</TableHeader>
				<TableBody>
					{[...Array(5)].map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Skeleton className="rounded-full w-8 h-8" />
									<Skeleton className="h-4 w-24 rounded-lg" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-12 rounded-lg" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}

	return (
		<>
			<Table
				isHeaderSticky
				removeWrapper
				className="overflow-y-auto h-full"
			>
				<TableHeader>
					<TableColumn>{headers[0]}</TableColumn>
					<TableColumn>{headers[1]}</TableColumn>
				</TableHeader>

				<TableBody emptyContent={emptyContent}>
					{(data ?? []).map((item, index) => (
						<TableRow key={index}>
							<TableCell>
								<div className="flex flex-row items-center gap-2">
									<Avatar
										size="sm"
										src={item.image}
										name={item.name}
									/>
									<span className="text-sm font-medium line-clamp-1">
										{item.name}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<span className="text-sm text-default-500 whitespace-nowrap">
									{item.value}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
