import { MessageIcon, SendIcon, ExclamationCircle } from "@/components/icons";
import { MessageListDesktop } from "@/pages/Admin/MessagesComponent/MessageListDesktop";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Avatar,
	Input,
	Button,
	useDisclosure,
} from "@heroui/react";
import { EditUserModal } from "@/pages/Admin/UsersComponent/EditUserModal";
export default function Messages() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<div className="flex flex-col gap-8 p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div className="flex flex-row items-center gap-2">
						<MessageIcon className="w-10" />
						<div className="text-3xl font-semibold">Messages</div>
					</div>
					<div className="flex flex-row gap-1 items-center text-muted-foreground">
						<div className="text-base text-default-200">
							Logged in as{" "}
						</div>
						<div className="text-lg font-semibold">
							Admin Bern Vein
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-2">
					<MessageListDesktop />
					<Card className="w-2/3 h-[88vh]">
						<CardHeader className="flex gap-3">
							<div className="flex flex-row gap-2 items-center w-full">
								<div className="flex flex-row justify-between w-full">
									<div className="flex flex-row gap-2 items-center">
										<Avatar />
										<span className="font-semibold">
											User 1
										</span>
									</div>
									<div className="flex flex-row gap-2 items-center">
										<Button
											variant="light"
											isIconOnly
											onPress={onOpen}
										>
											<ExclamationCircle className="w-7" />
										</Button>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardBody className="flex flex-col-reverse overflow-y-auto space-y-3-reverse p-3 gap-2">
							{/* Admin message */}
							<div className="flex justify-end gap-2 items-start">
								<div className="flex flex-col gap-1 items-end">
									<span className="text-xs font-default-200">
										Admin Vein
									</span>
									<div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
										Let me check that for you right now.
									</div>
								</div>
								<Avatar size="sm" className="shrink-0" />
							</div>

							{/* User message */}
							<div className="flex justify-start gap-2 items-start">
								<Avatar size="sm" className="shrink-0" />
								<div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
									It says completed but I haven’t received it
									yet.
								</div>
							</div>

							{/* Admin message */}
							<div className="flex justify-end gap-2 items-start">
								<div className="flex flex-col gap-1 items-end">
									<span className="text-xs text-default-600">
										Admin Alex
									</span>
									<div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
										Sure! What seems to be the problem?
									</div>
								</div>
								<Avatar size="sm" className="shrink-0" />
							</div>

							{/* User message */}
							<div className="flex justify-start gap-2 items-start">
								<Avatar size="sm" className="shrink-0" />
								<div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
									Hello admin, I have a question about my
									order.
								</div>
							</div>
						</CardBody>

						<CardFooter className="flex flex-row gap-2">
							<Input placeholder="Type your message..." />
							<Button isIconOnly variant="light">
								<SendIcon className="w-5" />
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
			<EditUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</>
	);
}
