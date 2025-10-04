import {
	Navbar as HeroNavBar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	DropdownItem,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	Avatar,
} from "@heroui/react";
import { BaybayaniLogo, ShoppingBag, CartIcon, OrdersIcon } from "./icons";
import { useState } from "react";
export const AcmeLogo = () => {
	return (
		<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
			<path
				clipRule="evenodd"
				d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
				fill="currentColor"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export function Navbar() {
	const [active, setActive] = useState("Shop");
	return (
		<HeroNavBar>
			<NavbarBrand>
				<BaybayaniLogo />
				<p className="font-bold hidden sm:block sm:text-lg text-green-700">
					BAYBAYANI
				</p>
			</NavbarBrand>
			<NavbarContent
				as="div"
				className="items-center sm:gap-10 gap-4"
				justify="end"
			>
				<NavbarItem isActive={active === "Shop"}>
					<Link
						href="#"
						color={active === "Shop" ? "success" : "foreground"}
						onClick={() => setActive("Shop")}
					>
						<div className="flex items-center gap-2">
							<ShoppingBag />
							<span className="hidden sm:inline">Shop</span>
						</div>
					</Link>
				</NavbarItem>
				<NavbarItem isActive={active === "Cart"}>
					<Link
						href="#"
						color={active === "Cart" ? "success" : "foreground"}
						onClick={() => setActive("Cart")}
					>
						<div className="flex items-center gap-2">
							<CartIcon />
							<span className="hidden sm:inline">Cart</span>
						</div>
					</Link>
				</NavbarItem>
				<NavbarItem isActive={active === "Orders"}>
					<Link
						href="#"
						color={active === "Orders" ? "success" : "foreground"}
						onClick={() => setActive("Orders")}
					>
						<div className="flex items-center gap-2">
							<OrdersIcon />
							<span className="hidden sm:inline">Orders</span>
						</div>
					</Link>
				</NavbarItem>
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar
							isBordered
							as="button"
							className="transition-transform"
							color="success"
							name="Bern Vein Balermo"
							size="sm"
							src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
						/>
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem key="profile" className="h-14 gap-2">
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold">
								realbernvein@gmail.com
							</p>
						</DropdownItem>
						<DropdownItem key="settings">Settings</DropdownItem>
						<DropdownItem key="analytics">Analytics</DropdownItem>
						<DropdownItem key="logout" color="danger">
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</HeroNavBar>
	);
}
