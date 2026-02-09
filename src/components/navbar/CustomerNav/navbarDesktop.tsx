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
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  BaybayaniLogo,
  CartIcon,
  SearchIcon,
  MessageIcon,
} from "@/components/icons";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { useRealtimeUserCart } from "@/data/supabase/Customer/Cart/useRealtimeUserCart";

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
  const { cartItems } = useRealtimeUserCart(userId);
  const cartCount = cartItems.length;

  const { items: fetchedItems, loading } = useFetchNavbarItems();
  const searchItems = fetchedItems.map((i, index) => ({
    label: i.item_title,
    key: `${i.item_title}-${index}`,
  }));

  return (
    <HeroNavBar>
      {/* Brand */}
      <NavbarBrand className="flex-shrink-0 hidden sm:flex">
        <Link
          className="flex items-center gap-2"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setActive("");
            navigate("/");
          }}
        >
          <BaybayaniLogo className="size-10" />
          <p className="font-bold hidden sm:block sm:text-lg">
            <span className="text-[#146A38]">BAYBAY</span>
            <span className="text-[#F9C424]">ANI</span>
          </p>
        </Link>
      </NavbarBrand>

      {/* Search bar */}
      <NavbarContent className="flex-grow px-2 max-w-full" justify="center">
        <Autocomplete
          allowsCustomValue
          fullWidth
          className="w-full opacity-90"
          defaultItems={searchItems}
          isDisabled={loading}
          placeholder={loading ? "Gathering items..." : "Search products..."}
          selectorIcon={null}
          size="sm"
          startContent={
            loading ? (
              <Spinner color="success" size="sm" />
            ) : (
              <SearchIcon className="size-5 text-default-500" />
            )
          }
          value={searchValue}
          variant="flat"
          onClear={() => {
            setSearchValue("");
            setSearchTerm("");
            setShowSuggestions(false);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              if (location.pathname !== "/") {
                navigate("/");
              }
              setSearchTerm(searchValue);
              (e.target as HTMLInputElement).blur();
            }
          }}
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
                      (document.activeElement as HTMLInputElement)?.blur();
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
            color={active === "Messages" ? "success" : "foreground"}
            href="/messages"
            onClick={(e) => {
              e.preventDefault();
              setActive("Messages");
              navigate("/messages");
            }}
          >
            <div className="flex items-center gap-2">
              <Badge
                color="danger"
                content="3"
                shape="circle"
                showOutline={false}
              >
                <MessageIcon className="size-6" />
              </Badge>
              <span className="hidden sm:inline font-normal">Chat</span>
            </div>
          </Link>
        </NavbarItem>

        <NavbarItem
          className="hidden sm:inline-block"
          isActive={active === "Cart"}
        >
          <Link
            color={active === "Cart" ? "success" : "foreground"}
            href="/cart"
            onClick={(e) => {
              e.preventDefault();
              setActive("Cart");
              navigate("/cart");
            }}
          >
            <div className="flex items-center gap-2">
              {cartCount > 0 ? (
                <Badge
                  color="success"
                  content={String(cartCount)}
                  shape="circle"
                  showOutline={false}
                >
                  <CartIcon className="size-6" />
                </Badge>
              ) : (
                <CartIcon className="size-6" />
              )}
              <span className="hidden sm:inline font-normal">Cart</span>
            </div>
          </Link>
        </NavbarItem>

        <Dropdown closeOnSelect={false} placement="bottom-end">
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
              className="h-14 gap-2"
              onPress={() => navigate("/profile")}
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">realbernvein@gmail.com</p>
            </DropdownItem>
            <DropdownItem key="theme">
              <div className="flex flex-row w-full justify-between">
                <span className="font-semibold">Dark mode</span>
                <ThemeSwitcher />
              </div>
            </DropdownItem>
            <DropdownItem key="orders" onPress={() => navigate("/orders")}>
              Orders
            </DropdownItem>
            <DropdownItem key="settings" onPress={() => navigate("/settings")}>
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
      </NavbarContent>
    </HeroNavBar>
  );
}
