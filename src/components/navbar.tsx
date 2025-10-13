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
	Autocomplete,
	AutocompleteItem,
} from "@heroui/react";
import {
	BaybayaniLogo,
	ShoppingBag,
	CartIcon,
	OrdersIcon,
	SearchIcon,
} from "./icons";
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
export const animals = [
	{
		label: "Cat",
		key: "cat",
		description: "The second most popular pet in the world",
	},
	{
		label: "Dog",
		key: "dog",
		description: "The most popular pet in the world",
	},
	{
		label: "Elephant",
		key: "elephant",
		description: "The largest land animal",
	},
	{ label: "Lion", key: "lion", description: "The king of the jungle" },
	{ label: "Tiger", key: "tiger", description: "The largest cat species" },
	{
		label: "Giraffe",
		key: "giraffe",
		description: "The tallest land animal",
	},
	{
		label: "Dolphin",
		key: "dolphin",
		description:
			"A widely distributed and diverse group of aquatic mammals",
	},
	{
		label: "Penguin",
		key: "penguin",
		description: "A group of aquatic flightless birds",
	},
	{
		label: "Zebra",
		key: "zebra",
		description: "A several species of African equids",
	},
	{
		label: "Shark",
		key: "shark",
		description:
			"A group of elasmobranch fish characterized by a cartilaginous skeleton",
	},
	{
		label: "Whale",
		key: "whale",
		description: "Diverse group of fully aquatic placental marine mammals",
	},
	{
		label: "Otter",
		key: "otter",
		description: "A carnivorous mammal in the subfamily Lutrinae",
	},
	{
		label: "Crocodile",
		key: "crocodile",
		description: "A large semiaquatic reptile",
	},
];

export function Navbar() {
	const [active, setActive] = useState("Shop");
	return (
		<HeroNavBar>
			<NavbarBrand className="hidden md:flex">
				<BaybayaniLogo />
				<p className="font-bold hidden sm:block sm:text-lg text-green-700">
					BAYBAYANI
				</p>
			</NavbarBrand>
			<NavbarContent>
				<Autocomplete
					size="sm"
					fullWidth={true}
					className="pl-4 w-full opacity-80"
					defaultItems={animals}
					defaultSelectedKey="cat"
					placeholder="Search"
					startContent={<SearchIcon className="md:size-6 size-12" />}
					variant="flat"
				>
					{(item) => (
						<AutocompleteItem key={item.key}>
							{item.label}
						</AutocompleteItem>
					)}
				</Autocomplete>
			</NavbarContent>
			<NavbarContent
				as="div"
				className="items-center gap-6"
				justify="end"
			>
				<NavbarItem isActive={active === "Shop"}>
					<Link
						href="/"
						color={active === "Shop" ? "success" : "foreground"}
						onClick={() => setActive("Shop")}
					>
						<div className="flex items-center gap-2">
							<ShoppingBag className="size-6" />
							<span className="hidden sm:inline">Shop</span>
						</div>
					</Link>
				</NavbarItem>
				<NavbarItem isActive={active === "Cart"}>
					<Link
						href="/cart"
						color={active === "Cart" ? "success" : "foreground"}
						onClick={() => setActive("Cart")}
					>
						<div className="flex items-center gap-2">
							<CartIcon className="size-6" />
							<span className="hidden sm:inline">Cart</span>
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
						<DropdownItem
							key="orders"
							href="/orders"
							onClick={() => setActive("")}
						>
							Orders
						</DropdownItem>
						<DropdownItem
							key="settings"
							href="/settings"
							onClick={() => setActive("")}
						>
							Settings
						</DropdownItem>
						<DropdownItem
							key="logout"
							href="/logout"
							color="danger"
							onClick={() => setActive("")}
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</HeroNavBar>
	);
}
