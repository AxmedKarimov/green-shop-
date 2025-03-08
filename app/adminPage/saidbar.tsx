"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Children } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdProductionQuantityLimits,
} from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/adminPage/dashboard",
      label: "Dashboard",
      icon: <MdOutlineSpaceDashboard className="w-6 h-6" />,
    },
    {
      href: "/adminPage/categories",
      label: "Categories",
      icon: <BiCategoryAlt className="w-6 h-6" />,
    },
    {
      href: "/adminPage/products",
      label: "Products",
      icon: <AiOutlineProduct className="w-6 h-6" />,
    },
    {
      href: "/adminPage/users",
      label: "Users",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      href: "/adminPage/orders",
      label: "Orders",
      icon: <MdProductionQuantityLimits className="w-6 h-6" />,
    },
  ];

  return (
    <div className="h-full w-96 border bg-neutral-100">
      <img
        src="/logo (2).webp"
        className="w-56 h-56 rounded-full shadow-2xl mx-auto mt-3 mb-4"
        alt="Logo"
      />
      <div className="flex flex-col items-start justify-start">
        {menuItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex ms-9 items-center gap-3 cursor-pointer mb-3 p-3 h-12 text-1xl font-semibold transition duration-300 ease-in-out rounded-lg
                ${
                  isActive
                    ? "border-2 border-green-600 bg-green-600 text-white text-decoration-none text-4xl"
                    : "text-[#46A358] hover:bg-green-600 hover:text-white text-decoration-none text-4xl"
                }
              `}
            >
              {icon}
              <h1 className="text-4xl text-decoration-none">{label}</h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
