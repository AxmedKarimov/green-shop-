"use client";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdProductionQuantityLimits,
} from "react-icons/md";
import Sidebar from "./saidbar";

export default function AdminPage() {
  const [adminPage, setAdminPage] = useState<string>("");

  return (
    <div className="w-full flex items-center h-screen">
      {/* saidbar */}
      <Sidebar />
      {/* body */}

      <div className="h-full w-full border "></div>
    </div>
  );
}
