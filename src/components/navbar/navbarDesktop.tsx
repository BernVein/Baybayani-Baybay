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
import { BaybayaniLogo, CartIcon, SearchIcon, MessageIcon } from "../icons";
import { useState } from "react";
import { items } from "@/data/items";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeSwitcher from "./themeSwitcher";
import { useFetchCart } from "@/data/supabase/useFetchCart";

const searchItems = items.map((i, index) => ({
	label: i.item_title,
	key: `${i.item_title}-${index}`,
	description: i.item_category,
}));

export function Navbar({
  setSearchTerm,
}: {
  setSearchTerm: (val: string) => void;
}) {
  const [active, setActive] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = "cb20faec-72c0-4c22-b9d4-4c50bfb9e66f";
  const { cart } = useFetchCart(userId);
  const cartCount = (cart?.items ?? []).length;

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
							// reset search filter
							setSearchTerm("");
							setShowSuggestions(false);
						} else {
							setShowSuggestions(true);
						}
					}}
					allowsCustomValue
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							// if not on the shop page, go there
							if (location.pathname !== "/") {
								navigate("/shop");
							}
							setSearchTerm(searchValue);

							(e.target as HTMLInputElement).blur();
						}
					}}
					onClear={() => {
						// <-- this handles the X button if your component exposes this
						setSearchValue("");
						setSearchTerm("");
						setShowSuggestions(false);
					}}
				>
					{showSuggestions
						? searchItems.slice(0, 20).map((item) => (
								<AutocompleteItem
									key={item.key}
									onClick={() => {
										// Redirect to shop if user is elsewhere
										if (location.pathname !== "/") {
											navigate("/");
										}
										setSearchValue(item.label);
										setSearchTerm(item.label);
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
            {cartCount > 0 ? (
              <Badge
                content={String(cartCount)}
                color="success"
                shape="circle"
                showOutline={false}
              >
                <CartIcon className="size-6" />
              </Badge>
            ) : (
              <CartIcon className="size-6" />
            )}
							<span className="hidden sm:inline font-normal">
								Cart
							</span>
						</div>
					</Link>
				</NavbarItem>

				<Dropdown placement="bottom-end" closeOnSelect={false}>
					<DropdownTrigger>
						<Avatar
							isBordered
							as="button"
							className="transition-transform"
							color="success"
							name="Bern Vein Balermo"
							size="sm"
							src="https://picsum.photos/300/300?random=45"
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
			</NavbarContent>
		</HeroNavBar>
	);
}
