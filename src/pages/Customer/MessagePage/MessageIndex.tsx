import { BaybayaniLogo } from "@/components/icons";
import { RealtimeChat } from "@/data/supabase/General/realtime-chat";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

export default function MessageIndex() {
	document.body.style.overflow = "hidden";

	const auth = useAuth();
	const user = auth?.user ?? null;
	const profile = auth?.profile ?? null;

	if (!user || !profile) {
		return (
			<div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-default-400">
				<BaybayaniLogo className="size-12 opacity-30" />
				<p className="text-lg">Please log in to access messages.</p>
			</div>
		);
	}

	const roomName = `user-${user.id}`;
	const username = profile.user_name;

	return (
		<>
			{/* Header */}
			<div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
				<div className="flex items-center gap-2">
					<BaybayaniLogo className="size-7" />
					<h2 className="text-xl sm:text-3xl font-semibold">
						Baybayani <span className="text-default-400">|</span>{" "}
						Message
					</h2>
				</div>
			</div>

			{/* Chat Card */}
			<div className="flex justify-center w-full mt-5 px-4">
				<div className="h-[70vh] sm:h-[80vh] w-full sm:w-3/4 border border-divider rounded-xl overflow-hidden bg-content1 shadow-md flex flex-col">
					{/* Chat Header */}
					<div className="flex items-center gap-3 px-4 py-3 border-b border-divider bg-content2">
						<div className="flex flex-col">
							<span className="font-semibold text-sm">
								Baybayani Support
							</span>
							<span className="text-xs text-default-400">
								Chat with our admin team
							</span>
						</div>
					</div>

					{/* RealtimeChat fills the rest */}
					<div className="flex-1 min-h-0">
						<RealtimeChat roomName={roomName} username={username} />
					</div>
				</div>
			</div>
		</>
	);
}
