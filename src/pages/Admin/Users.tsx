import { UserIcon } from "@/components/icons";
import { useOutletContext } from "react-router-dom";
import { UsersSummary } from "@/pages/Admin/UsersComponent/UsersSummary";
import { UsersTableMobile } from "@/pages/Admin/UsersComponent/UsersTableMobile";
import { UsersTableDesktop } from "@/pages/Admin/UsersComponent/UsersTableDesktop";
import { FilterSection } from "@/pages/Admin/UsersComponent/FilterSection";
import { fetchAllUsers } from "@/data/supabase/Admin/Users/fetchAllUsers";
import {
	Skeleton,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/react";

export default function Users() {
	const { profile } = useOutletContext<any>();
	const { userProfiles, loading } = fetchAllUsers();

	const renderSkeleton = () => (
		<div className="flex-1 min-h-0 flex flex-col">
			{/* --- MOBILE SKELETON --- */}
			<div className="sm:hidden">
				<Table className="w-full">
					<TableHeader>
						<TableColumn>USER INFO</TableColumn>
						<TableColumn>DATE REGISTERED</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-32 rounded-md" />
										<Skeleton className="h-3 w-24 rounded-md" />
										<Skeleton className="h-3 w-20 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-24 rounded-md" />
										<Skeleton className="h-3 w-16 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-row gap-1">
										<Skeleton className="h-8 w-8 rounded-md" />
										<Skeleton className="h-8 w-8 rounded-md" />
									</div>
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
						<TableColumn>USER</TableColumn>
						<TableColumn>ROLE</TableColumn>
						<TableColumn>STATUS</TableColumn>
						<TableColumn>PHONE NUMBER</TableColumn>
						<TableColumn>DATE REGISTERED</TableColumn>
						<TableColumn>ACTIONS</TableColumn>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<div className="flex items-center gap-2">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div className="flex flex-col gap-2">
											<Skeleton className="h-4 w-32 rounded-md" />
											<Skeleton className="h-3 w-24 rounded-md" />
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-20 rounded-md" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-24 rounded-full" />
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-28 rounded-md" />
										<Skeleton className="h-3 w-20 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<Skeleton className="h-4 w-28 rounded-md" />
										<Skeleton className="h-3 w-20 rounded-md" />
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-row gap-1">
										<Skeleton className="h-8 w-8 rounded-md" />
										<Skeleton className="h-8 w-8 rounded-md" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col gap-8 p-4 h-full">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
				<div className="flex flex-row items-center gap-2">
					<UserIcon className="w-10" />
					<div className="text-3xl font-semibold">Users</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">
						{profile?.user_name ?? "Admin"}
					</div>
				</div>
			</div>
			<div className="hidden sm:block shrink-0">
				<UsersSummary />
			</div>

			<div className="flex flex-row items-center justify-between shrink-0">
				<FilterSection />
			</div>

			{loading && (!userProfiles || userProfiles.length === 0) ? (
				renderSkeleton()
			) : (
				<div className="flex-1 min-h-0 flex flex-col">
					<UsersTableMobile
						userProfiles={userProfiles}
						isLoading={loading}
					/>
					<UsersTableDesktop userProfiles={userProfiles} />
				</div>
			)}
		</div>
	);
}
