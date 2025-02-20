"use client";

import { menuItems } from "@/configs/menu";
import { Link } from "@heroui/link";
import { NavbarItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map((menuItem) => (
        <NavbarItem key={menuItem.href} isActive={pathname === menuItem.href}>
          <Link size="sm" color="foreground" href={menuItem.href}>
            {menuItem.label}
          </Link>
        </NavbarItem>
      ))}
    </>
  );
}
