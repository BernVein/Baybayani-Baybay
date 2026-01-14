import { UserIcon } from "@/components/icons";

export default function Users() {
	return (
		<div className="flex flex-col gap-8 p-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="flex flex-row items-center gap-2">
					<UserIcon className="w-10" />
					<div className="text-3xl font-semibold">Users</div>
				</div>
				<div className="flex flex-row gap-1 items-center text-muted-foreground">
					<div className="text-base text-default-500">
						Logged in as{" "}
					</div>
					<div className="text-lg font-semibold">Admin Bern Vein</div>
				</div>
			</div>
		</div>
	);
}
