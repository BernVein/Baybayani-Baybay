export default function Dashboard() {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between gap-2">
				<div className="text-3xl font-semibold">Dashboard</div>
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
