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
	addToast,
} from "@heroui/react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
	DashboardIcon,
	MoreIcon,
	OrdersIcon,
	ProductIcon,
	UserIcon,
} from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { supabase } from "@/config/supabaseclient";
import { UserProfile } from "@/model/userProfile";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";

export function NavbarMobileAdmin({
	profile,
}: {
	profile: UserProfile | null;
}) {
	const [active, setActive] = useState("");
	const navigate = useNavigate();

	const isLoggingOut = useRef(false);

	const handleLogOut = async () => {
		if (isLoggingOut.current) return;
		isLoggingOut.current = true;
		try {
			await unregisterPush();
			await supabase.auth.signOut();
			navigate("/shop");
			addToast({
				title: "Signed out",
				description: "You have been signed out successfully",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		} catch (error) {
			isLoggingOut.current = false;
			addToast({
				title: "Error",
				description: error as string,
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		}
	};

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
								onPress={() => navigate("/admin/products")}
								startContent={<ProductIcon className="w-5" />}
							>
								Products
							</DropdownItem>
							<DropdownItem
								key="users"
								onPress={() => navigate("/admin/users")}
								startContent={<UserIcon className="w-5" />}
							>
								Users
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
									src={profile?.user_profile_img_url}
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
								{profile?.login_user_name}
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
							onPress={handleLogOut}
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>
		</HeroNavBar>
	);
}
