import {
	Navbar as HeroNavBar,
	NavbarItem,
	Link,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	Avatar,
	Badge,
	Divider,
} from "@heroui/react";
import { BaybayaniLogo, CartIcon, MessageIcon } from "../icons";
import { useState } from "react";
import ThemeSwitcher from "./themeSwitcher";
export function NavbarMobile() {
	const [active, setActive] = useState("");

	return (
		<HeroNavBar className="justify-around py-2 shadow-md">
			{/* Shop / Logo */}
			<NavbarItem
				isActive={active === "Shop"}
				className="flex flex-col items-center"
			>
				<Link
					href="/"
					onClick={() => setActive("Shop")}
					className="flex flex-col items-center"
					color={active === "Shop" ? "success" : "foreground"}
				>
					<div className="w-8 h-8 flex items-center justify-center">
						<BaybayaniLogo className="size-7" />
					</div>
					<span className="text-sm font-light mt-1">Shop</span>
				</Link>
			</NavbarItem>

			<Divider orientation="vertical" className="h-8 bg-gray-300" />

			<NavbarItem
				isActive={active === "Messages"}
				className="flex flex-col items-center"
			>
				<Link
					href="/messages"
					onClick={() => setActive("Messages")}
					className="flex flex-col items-center"
					color={active === "Messages" ? "success" : "foreground"}
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
							<MessageIcon className="w-6 h-6" />
						</Badge>
					</div>
					<span className="text-sm font-light mt-1">Chat</span>
				</Link>
			</NavbarItem>
			<Divider orientation="vertical" className="h-8 bg-gray-300" />

			{/* Cart */}
			<NavbarItem
				isActive={active === "Cart"}
				className="flex flex-col items-center"
			>
				<Link
					href="/cart"
					onClick={() => setActive("Cart")}
					className="flex flex-col items-center"
					color={active === "Cart" ? "success" : "foreground"}
				>
					<div className="w-8 h-8 flex items-center justify-center relative">
						<Badge
							content="3"
							color="success"
							shape="circle"
							showOutline={false}
							className="absolute top-0 right-0 translate-x-1 -translate-y-1"
							size="sm"
						>
							<CartIcon className="w-6 h-6" />
						</Badge>
					</div>
					<span className="text-sm font-light mt-1">Cart</span>
				</Link>
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
							href="/profile"
							className="h-14 gap-2"
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
						<DropdownItem key="orders" href="/orders">
							Orders
						</DropdownItem>
						<DropdownItem key="settings" href="/settings">
							Settings
						</DropdownItem>
						<DropdownItem
							key="logout"
							href="/logout"
							color="danger"
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarItem>
		</HeroNavBar>
	);
}
