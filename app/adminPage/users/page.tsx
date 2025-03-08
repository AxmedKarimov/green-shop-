"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdProductionQuantityLimits,
} from "react-icons/md";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";

interface User {
  id: number;
  name: string;
  email: string;
  user: string;
  password: string;
  role: string;
  image?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const supabase = createClient();

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Foydalanuvchilarni olishda xatolik:", error);
    } else if (data) {
      setUsers(data as User[]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full flex items-center h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Body */}
      <div className="h-full w-full bg-slate-100 p-10 overflow-auto">
        <div className="h-full w-full bg-white rounded-lg p-10 shadow-sm">
          <h1 className="text-4xl font-semibold mb-10 ">Users</h1>

          {/* Jadval */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-green-300 shadow-sm">
              <thead className="bg-green-200">
                <tr>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">email</th>
                  <th className="border p-3">Password</th>
                  <th className="border p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="border p-3 text-center">{user.id}</td>

                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.password}</td>
                    <td className="border p-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
