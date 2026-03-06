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
	addToast,
} from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";

import { BaybayaniLogo } from "@/components/icons";
import {
	DashboardIcon,
	CartIcon,
	UserIcon,
	ProductIcon,
	LogoutIcon,
	ClockIcon,
} from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { UserProfile } from "@/model/userProfile";

export function SidebarDesktopAdmin({
	profile,
}: {
	profile: UserProfile | null;
}) {
	const navigate = useNavigate();
	const location = useLocation();

	// Map pathname to the Listbox key
	const pathToKey: Record<string, string> = {
		"/admin/dashboard": "dashboard",
		"/admin/orders": "orders",
		"/admin/products": "products",
		"/admin/users": "users",
	};

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
	const selectedKey = pathToKey[location.pathname];

	const [, setTick] = useState(0);

	useEffect(() => {
		const tick = () => setTick((n) => n + 1);

		const now = new Date();
		const msToNextMinute =
			(60 - now.getSeconds()) * 1000 - now.getMilliseconds();

		const timeout = setTimeout(() => {
			tick();
			const interval = setInterval(tick, 60_000);

			return () => clearInterval(interval);
		}, msToNextMinute);

		return () => clearTimeout(timeout);
	}, []);

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
				<div className="flex flex-row items-center gap-2 mb-3 pl-3">
					<ClockIcon className="w-6" />

					<span className="text-sm text-default-500">
						Current Time:
					</span>
					<span>
						{new Date().toLocaleString("en-PH", {
							timeZone: "Asia/Manila",
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						})}
					</span>
				</div>

				<Listbox
					hideSelectedIcon
					aria-label="Actions"
					itemClasses={{
						base: [
							// default styles
							"data-[hover=true]:bg-success-100",
							"data-[hover=true]:text-success-900",
							// selected
							"data-[selected=true]:bg-success-100",
							"data-[selected=true]:text-success-900",
						].join(" "),
					}}
					selectedKeys={selectedKey ? [selectedKey] : []}
					selectionMode="single"
				>
					<ListboxSection showDivider title="Overview">
						<ListboxItem
							key="dashboard"
							className="mb-3"
							color="success"
							onPress={() => navigate("/admin/dashboard")}
							startContent={<DashboardIcon className="size-6" />}
						>
							Dashboard
						</ListboxItem>
					</ListboxSection>
					<ListboxSection showDivider title="Manage">
						<ListboxItem
							key="orders"
							className="mb-3"
							color="success"
							onPress={() => navigate("/admin/orders")}
							startContent={<CartIcon className="size-6" />}
						>
							Orders
						</ListboxItem>
						<ListboxItem
							key="products"
							className="mb-3"
							color="success"
							onPress={() => navigate("/admin/products")}
							startContent={<ProductIcon className="size-6" />}
						>
							Products
						</ListboxItem>
						<ListboxItem
							key="users"
							className="mb-3"
							color="success"
							onPress={() => navigate("/admin/users")}
							startContent={<UserIcon className="size-6" />}
						>
							Users
						</ListboxItem>
					</ListboxSection>
					<ListboxSection title="Account">
						<ListboxItem
							key="logout"
							className=""
							color="danger"
							startContent={<LogoutIcon className="size-6" />}
							onPress={handleLogOut}
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
										src={profile?.user_profile_img_url}
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
									{profile?.login_user_name}
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
					<div className="flex flex-col items-start text-start overflow-hidden w-full">
						<span className="text-sm truncate w-full">
							{profile?.user_name}
						</span>
						<span className="text-xs text-default-600">
							{profile?.user_role}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
