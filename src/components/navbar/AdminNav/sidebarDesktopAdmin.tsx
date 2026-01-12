import { BaybayaniLogo } from "@/components/icons";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Avatar,
	Listbox,
	ListboxItem,
	ListboxSection,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/react";
import {
	DashboardIcon,
	CartIcon,
	UserIcon,
	ProductIcon,
	MessageIcon,
	LogoutIcon,
} from "@/components/icons";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";

export function SidebarDesktopAdmin() {
	const navigate = useNavigate();
	return (
		<Card className="w-[300px] h-full rounded-none">
			<CardHeader className="flex gap-3">
				<BaybayaniLogo className="size-10" />
				<div className="flex flex-col">
					<p className="font-bold block text-base">
						<span className="text-[#146A38]">BAYBAY</span>
						<span className="text-[#F9C424]">ANI</span>
					</p>
					<p className="text-small text-default-500">
						Closing time: 5:00 pm
					</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				<Listbox
					aria-label="Actions"
					className="top-10"
					// onAction={(key) =(key)}
				>
					<ListboxSection showDivider title="Overview">
						<ListboxItem
							key="dashboard"
							className="mb-3"
							startContent={<DashboardIcon className="size-6" />}
							color="success"
							href="/admin/dashboard"
						>
							Dashboard
						</ListboxItem>
					</ListboxSection>
					<ListboxSection showDivider title="Manage">
						<ListboxItem
							key="orders"
							className="mb-3"
							startContent={<CartIcon className="size-6" />}
							color="success"
							href="/admin/orders"
						>
							Orders
						</ListboxItem>
						<ListboxItem
							key="products"
							className="mb-3"
							startContent={<ProductIcon className="size-6" />}
							color="success"
							href="/admin/products"
						>
							Products
						</ListboxItem>
						<ListboxItem
							key="users"
							className="mb-3"
							startContent={<UserIcon className="size-6" />}
							color="success"
							href="/admin/users"
						>
							Users
						</ListboxItem>
						<ListboxItem
							key="messages"
							className="mb-3"
							startContent={<MessageIcon className="size-6" />}
							color="success"
							href="/admin/messages"
						>
							Messages
						</ListboxItem>
					</ListboxSection>
					<ListboxSection title="Account">
						<ListboxItem
							key="logout"
							className=""
							startContent={<LogoutIcon className="size-6" />}
							color="danger"
						>
							Log Out
						</ListboxItem>
					</ListboxSection>
				</Listbox>
			</CardBody>
			<Divider />
			<CardFooter className="h-auto">
				<div className="flex flex-row gap-3 items-center">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<div className="flex flex-col items-center cursor-pointer">
								<div className="w-8 h-8 flex items-center justify-center">
									<Avatar
										isBordered
										as="button"
										color="success"
										size="sm"
										src="https://picsum.photos/300/300?random=42"
									/>
								</div>
							</div>
						</DropdownTrigger>

						<DropdownMenu
							aria-label="Profile Actions"
							variant="flat"
						>
							<DropdownItem
								key="profile"
								className="h-14 gap-2"
								onPress={() => navigate("/admin/profile")}
							>
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">
									realbernvein@gmail.com
								</p>
							</DropdownItem>
							<DropdownItem key="theme">
								<div className="flex flex-row w-full justify-between">
									<span className="font-semibold">
										Dark mode
									</span>
									<ThemeSwitcher />
								</div>
							</DropdownItem>

							<DropdownItem
								key="settings"
								onPress={() => navigate("/admin/settings")}
							>
								Settings
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<div className="flex flex-col items-start">
						<span className="text-sm">Bern Vein Balermo</span>
						<span className="text-xs text-default-600">Admin</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
