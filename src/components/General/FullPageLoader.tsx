export default function FullPageLoader() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground gap-4">
			<img
				src="/baybayani.ico"
				alt="Baybayani Logo"
				className="h-24 w-24 animate-pulse"
			/>
		</div>
	);
}
