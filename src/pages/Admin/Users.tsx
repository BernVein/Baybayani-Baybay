import { UserIcon } from "@/components/icons";
import { useOutletContext } from "react-router-dom";
import { UsersSummary } from "@/pages/Admin/UsersComponent/UsersSummary";
import { UsersTableMobile } from "@/pages/Admin/UsersComponent/UsersTableMobile";
import { UsersTableDesktop } from "@/pages/Admin/UsersComponent/UsersTableDesktop";
import { FilterSection } from "@/pages/Admin/UsersComponent/FilterSection";
import { fetchAllUsers } from "@/data/supabase/Admin/Users/fetchAllUsers";

export default function Users() {
	const { profile } = useOutletContext<any>();
	const { userProfiles, loading, refetch } = fetchAllUsers();
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

			<div className="flex-1 min-h-0 flex flex-col">
				<UsersTableMobile
					userProfiles={userProfiles}
					isLoading={loading}
					refetch={refetch}
				/>
				<UsersTableDesktop
					userProfiles={userProfiles}
					isLoading={loading}
					refetch={refetch}
				/>
			</div>
		</div>
	);
}
