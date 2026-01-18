import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Input,
	Listbox,
	ListboxItem,
	Avatar,
} from "@heroui/react";
import { SearchIcon, SoloUserIcon, GroupUserIcon } from "@/components/icons";
export function MessageListDesktop() {
	return (
		<Card className="w-1/3 h-[88vh]">
			<CardHeader className="flex gap-3">
				<div className="flex flex-col gap-2 items-center w-full">
					<Input
						placeholder="Search for a user"
						className="w-full"
						startContent={<SearchIcon />}
					/>
					<div className="flex flex-row items-center gap-2">
						<Button
							variant="light"
							startContent={<SoloUserIcon className="w-5" />}
						>
							Individual
						</Button>
						<Button
							variant="light"
							startContent={<GroupUserIcon className="w-5" />}
						>
							Cooperative
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<Listbox aria-label="Actions">
					{Array.from({ length: 20 }).map((_, i) => (
						<ListboxItem key={i} className="w-full mb-2">
							<div className="flex flex-row gap-2 items-center w-full">
								<Avatar className="shrink-0" />
								<div className="flex flex-col items-start w-full">
									<span className="font-semibold text-base">
										User {i + 1}
									</span>
									<div className="flex flex-row justify-between w-full gap-2">
										<span className="line-clamp-1">
											Admin 2: Admin response to user
											question
										</span>
										<span className="shrink-0 text-sm text-default-500">
											2 days ago
										</span>
									</div>
								</div>
							</div>
						</ListboxItem>
					))}
				</Listbox>
			</CardBody>
		</Card>
	);
}
