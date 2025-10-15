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
	Badge,
} from "@heroui/react";
import { BaybayaniLogo, CartIcon, SearchIcon, MessageIcon } from "./icons";
import { useState } from "react";
import { item } from "@/data/items";

export const AcmeLogo = () => (
	<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
		<path
			clipRule="evenodd"
			d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</svg>
);

const searchItems = item.map((i, index) => ({
	label: i.title,
	key: `${i.title}-${index}`,
	description: i.category,
}));

export function Navbar({
	setSearchTerm,
}: {
	setSearchTerm: (val: string) => void;
}) {
	const [active, setActive] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(true);

	return (
		<HeroNavBar>
			{/* Brand */}
			<NavbarBrand className="flex-shrink-0 hidden sm:flex">
				<Link
					href="/"
					className="flex items-center gap-2"
					onClick={() => setActive("")}
				>
					<BaybayaniLogo className="size-10" />
					<p className="font-bold hidden sm:block sm:text-lg">
						<span className="text-[#146A38]">BAYBAY</span>
						<span className="text-[#F9C424]">ANI</span>
					</p>
				</Link>
			</NavbarBrand>

			{/* Search bar */}
			<NavbarContent
				className="flex-grow px-2 max-w-full"
				justify="center"
			>
				<Autocomplete
					size="sm"
					fullWidth
					className="w-full opacity-90"
					defaultItems={searchItems}
					placeholder="Search products..."
					selectorIcon={null}
					startContent={
						<SearchIcon className="size-5 text-default-500" />
					}
					variant="flat"
					value={searchValue}
					onValueChange={(val) => {
						setSearchValue(val);

						if (val.trim() === "") {
							setSearchTerm(""); // reset search
							setShowSuggestions(false); // hide suggestions
						} else {
							setShowSuggestions(true); // show suggestions
						}
					}}
					allowsCustomValue
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							setSearchTerm(searchValue);
							(e.target as HTMLInputElement).blur();
						}
					}}
				>
					{showSuggestions
						? searchItems.slice(0, 20).map((item) => (
								<AutocompleteItem
									key={item.key}
									onClick={() => {
										setSearchValue(item.label);
										setSearchTerm(item.label);

										// hide keyboard on mobile
										setTimeout(() => {
											(
												document.activeElement as HTMLInputElement
											)?.blur();
										}, 100);
									}}
								>
									{item.label}
								</AutocompleteItem>
							))
						: null}
				</Autocomplete>
			</NavbarContent>

			{/* Cart + Avatar */}
			<NavbarContent
				as="div"
				className="flex-shrink-0 items-center gap-4 hidden sm:flex"
				justify="end"
			>
				<NavbarItem
					className="hidden sm:inline-block"
					isActive={active === "Messages"}
				>
					<Link
						href="/messages"
						color={active === "Messages" ? "success" : "foreground"}
						onClick={() => setActive("Messages")}
					>
						<div className="flex items-center gap-2">
							<Badge
								content="3"
								color="danger"
								shape="circle"
								showOutline={false}
							>
								<MessageIcon className="size-6" />
							</Badge>
							<span className="hidden sm:inline font-normal">
								Chat
							</span>
						</div>
					</Link>
				</NavbarItem>

				<NavbarItem
					className="hidden sm:inline-block"
					isActive={active === "Cart"}
				>
					<Link
						href="/cart"
						color={active === "Cart" ? "success" : "foreground"}
						onClick={() => setActive("Cart")}
					>
						<div className="flex items-center gap-2">
							<Badge
								content="3"
								color="success"
								shape="circle"
								showOutline={false}
							>
								<CartIcon className="size-6" />
							</Badge>
							<span className="hidden sm:inline font-normal">
								Cart
							</span>
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
			</NavbarContent>
		</HeroNavBar>
	);
}
