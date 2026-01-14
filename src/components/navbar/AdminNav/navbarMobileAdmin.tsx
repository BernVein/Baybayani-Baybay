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
import {
	DashboardIcon,
	MessageIcon,
	MoreIcon,
	OrdersIcon,
	ProductIcon,
	UserIcon,
} from "@/components/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
export function NavbarMobileAdmin() {
	const [active, setActive] = useState("");
	const navigate = useNavigate();

	return (
		<HeroNavBar className="justify-around py-2 shadow-md">
			{/* Shop / Logo */}
			<NavbarItem
				isActive={active === "Dashboard"}
				className="flex flex-col items-center"
			>
				<Link
					href="/admin/dashboard"
					onClick={(e) => {
						e.preventDefault();
						setActive("Dashboard");
						navigate("/admin/dashboard");
					}}
					className="flex flex-col items-center"
					color={active === "Dashboard" ? "success" : "foreground"}
				>
					<div className="w-8 h-8 flex items-center justify-center">
						<DashboardIcon className="size-7" />
					</div>
					<span className="text-sm font-light mt-1">Dashboard</span>
				</Link>
			</NavbarItem>

			<Divider orientation="vertical" className="h-8 bg-gray-300" />

			<NavbarItem
				isActive={active === "Orders"}
				className="flex flex-col items-center"
			>
				<Link
					href="/admin/orders"
					onClick={(e) => {
						e.preventDefault();
						setActive("Orders");
						navigate("/admin/orders");
					}}
					className="flex flex-col items-center"
					color={active === "Orders" ? "success" : "foreground"}
				>
					<div className="w-8 h-8 flex items-center justify-center relative">
						<Badge
							content="3"
							color="danger"
							shape="circle"
							showOutline={false}
							className="absolute top-0 right-0 translate-x-1 -translate-y-1"
							size="sm"
						>
							<OrdersIcon className="w-6 h-6" />
						</Badge>
					</div>
					<span className="text-sm font-light mt-1">Orders</span>
				</Link>
			</NavbarItem>
			<Divider orientation="vertical" className="h-8 bg-gray-300" />

			{/* Cart */}
			<NavbarItem
				isActive={active === "More"}
				className="flex flex-col items-center"
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
								href="/admin/products"
								key="products"
								startContent={<ProductIcon className="w-5" />}
							>
								Products
							</DropdownItem>
							<DropdownItem
								href="/admin/users"
								key="users"
								startContent={<UserIcon className="w-5" />}
							>
								Users
							</DropdownItem>
							<DropdownItem
								href="/admin/messages"
								key="messages"
								startContent={<MessageIcon className="w-5" />}
							>
								Messages
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>

			<Divider orientation="vertical" className="h-8 bg-gray-300" />

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
						>
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold">
								realbernvein@gmail.com
							</p>
						</DropdownItem>
						<DropdownItem key="theme">
							<div className="flex flex-row w-full justify-between">
								<span className="font-semibold">Dark mode</span>
								<ThemeSwitcher />
							</div>
						</DropdownItem>
						<DropdownItem
							key="orders"
							onPress={() => navigate("/orders")}
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
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>
		</HeroNavBar>
	);
}
