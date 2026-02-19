import {
	Navbar as HeroNavBar,
	NavbarItem,
	Link,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownSection,
	Avatar,
	Badge,
	Divider,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	DashboardIcon,
	MessageIcon,
	MoreIcon,
	OrdersIcon,
	ProductIcon,
	UserIcon,
} from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
export function NavbarMobileAdmin() {
	const [active, setActive] = useState("");
	const navigate = useNavigate();

	return (
		<HeroNavBar
			disableScrollHandler
			position="static"
			className="justify-around py-2 shadow-md"
		>
			{/* Shop / Logo */}
			<NavbarItem
				className="flex flex-col items-center"
				isActive={active === "Dashboard"}
			>
				<Link
					className="flex flex-col items-center"
					color={active === "Dashboard" ? "success" : "foreground"}
					href="/admin/dashboard"
					onClick={(e) => {
						e.preventDefault();
						setActive("Dashboard");
						navigate("/admin/dashboard");
					}}
				>
					<div className="w-8 h-8 flex items-center justify-center">
						<DashboardIcon className="size-7" />
					</div>
					<span className="text-sm font-light mt-1">Dashboard</span>
				</Link>
			</NavbarItem>

			<Divider className="h-8 bg-gray-300" orientation="vertical" />

			<NavbarItem
				className="flex flex-col items-center"
				isActive={active === "Orders"}
			>
				<Link
					className="flex flex-col items-center"
					color={active === "Orders" ? "success" : "foreground"}
					href="/admin/orders"
					onClick={(e) => {
						e.preventDefault();
						setActive("Orders");
						navigate("/admin/orders");
					}}
				>
					<div className="w-8 h-8 flex items-center justify-center relative">
						<Badge
							className="absolute top-0 right-0 translate-x-1 -translate-y-1"
							color="danger"
							content="3"
							shape="circle"
							showOutline={false}
							size="sm"
						>
							<OrdersIcon className="w-6 h-6" />
						</Badge>
					</div>
					<span className="text-sm font-light mt-1">Orders</span>
				</Link>
			</NavbarItem>
			<Divider className="h-8 bg-gray-300" orientation="vertical" />

			{/* Cart */}
			<NavbarItem
				className="flex flex-col items-center"
				isActive={active === "More"}
			>
				<Dropdown>
					<DropdownTrigger>
						<div className="flex flex-col items-center">
							<div className="w-8 h-8 flex items-center justify-center relative">
								<MoreIcon className="w-6 h-6" />
							</div>
							<span className="text-sm font-light mt-1">
								More
							</span>
						</div>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownSection title="Manage">
							<DropdownItem
								key="products"
								href="/admin/products"
								startContent={<ProductIcon className="w-5" />}
							>
								Products
							</DropdownItem>
							<DropdownItem
								key="users"
								href="/admin/users"
								startContent={<UserIcon className="w-5" />}
							>
								Users
							</DropdownItem>
							<DropdownItem
								key="messages"
								href="/admin/messages"
								startContent={<MessageIcon className="w-5" />}
							>
								Messages
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>

			<Divider className="h-8 bg-gray-300" orientation="vertical" />

			{/* Profile */}
			<NavbarItem className="flex flex-col items-center">
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
							<span className="text-sm font-light mt-1">
								Profile
							</span>
						</div>
					</DropdownTrigger>

					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem
							key="profile"
							className="h-14 gap-2"
							onPress={() => navigate("/profile")}
							shouldCloseOnSelect={true}
						>
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold">
								realbernvein@gmail.com
							</p>
						</DropdownItem>
						<DropdownItem key="theme" shouldCloseOnSelect={false}>
							<div className="flex flex-row w-full justify-between">
								<span className="font-semibold">Dark mode</span>
								<ThemeSwitcher />
							</div>
						</DropdownItem>
						<DropdownItem
							key="orders"
							onPress={() => navigate("/orders")}
							shouldCloseOnSelect={true}
						>
							Orders
						</DropdownItem>
						<DropdownItem
							key="settings"
							onPress={() => navigate("/settings")}
						>
							Settings
						</DropdownItem>
						<DropdownItem
							key="logout"
							color="danger"
							onPress={() => navigate("/logout")}
							shouldCloseOnSelect={true}
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>
		</HeroNavBar>
	);
}
