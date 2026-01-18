import { BaybayaniLogo } from "@/components/icons";
import { SendIcon } from "@/components/icons";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Avatar,
	Input,
	Button,
} from "@heroui/react";

export default function MessageIndex() {
	document.body.style.overflow = "hidden";

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
			<div className="flex justify-center w-full mt-5">
				<Card className="h-[70vh] sm:h-[80vh] flex sm:w-3/4">
					<CardHeader className="flex gap-3">
						<div className="flex flex-row gap-2 items-center w-full">
							<div className="flex flex-row justify-between w-full">
								<div className="flex flex-row gap-2 items-center">
									<Avatar />
									<span className="font-semibold">
										User 1
									</span>
								</div>
								{/* <div className="flex flex-row gap-2 items-center">
									<Button variant="light" isIconOnly>
										<ExclamationCircle className="w-7" />
									</Button>
								</div> */}
							</div>
						</div>
					</CardHeader>
					<CardBody className="flex flex-col-reverse overflow-y-auto space-y-3-reverse p-3 gap-2">
						<CardBody className="flex flex-col-reverse overflow-y-auto space-y-3-reverse p-3 gap-2">
							{/* User (You) */}
							<div className="flex justify-end gap-2 items-start">
								<div className="flex flex-col gap-1 items-end">
									<span className="text-xs text-default-600">
										You
									</span>
									<div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
										Hello admin, I have a question about my
										order.
									</div>
								</div>
								<Avatar size="sm" className="shrink-0" />
							</div>

							{/* Admin */}
							<div className="flex justify-start gap-2 items-start">
								<Avatar size="sm" className="shrink-0" />
								<div className="flex flex-col gap-1">
									<span className="text-xs text-default-600">
										Admin Alex
									</span>
									<div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
										Sure! What seems to be the problem?
									</div>
								</div>
							</div>

							{/* User (You) */}
							<div className="flex justify-end gap-2 items-start">
								<div className="flex flex-col gap-1 items-end">
									<span className="text-xs text-default-600">
										You
									</span>
									<div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
										It says completed but I haven’t received
										it yet.
									</div>
								</div>
								<Avatar size="sm" className="shrink-0" />
							</div>

							{/* Admin */}
							<div className="flex justify-start gap-2 items-start">
								<Avatar size="sm" className="shrink-0" />
								<div className="flex flex-col gap-1">
									<span className="text-xs text-default-600">
										Admin Vein
									</span>
									<div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
										Let me check that for you right now.
									</div>
								</div>
							</div>
						</CardBody>
					</CardBody>

					<CardFooter className="flex flex-row gap-2">
						<Input placeholder="Type your message..." />
						<Button isIconOnly variant="light">
							<SendIcon className="w-5" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
