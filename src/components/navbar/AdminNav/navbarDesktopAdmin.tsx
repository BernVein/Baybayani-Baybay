import React from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { BaybayaniLogo } from "@/components/icons";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <HeroNavbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarBrand className="flex-shrink-0">
          <Link
            className="flex items-center gap-2"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard");
            }}
          >
            <BaybayaniLogo className="size-10" />
            <p className="font-bold block sm:text-lg">
              <span className="text-[#146A38]">BAYBAY</span>
              <span className="text-[#F9C424]">ANI</span>
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <div className="flex flex-row items-center w-full gap-1">
            <span className="text-sm">Closing time:</span>
            <span>5:00 pm</span>
          </div>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
