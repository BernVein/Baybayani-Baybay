export default function FullPageLoader() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground gap-4">
			<img
				src="/icons/icon-512.webp"
				alt="Baybayani Logo"
				className="h-30 w-30 rounded-full object-cover animate-pulse"
			/>
		</div>
	);
}
