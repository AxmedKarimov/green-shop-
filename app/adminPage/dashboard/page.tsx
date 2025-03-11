"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";

export default function Dashboard() {
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: categoryCount } = await supabase
          .from("categories")
          .select("*", { count: "exact" });

        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact" });

        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: "exact" });

        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact" });

        setCategoryCount(categoryCount || 0);
        setProductCount(productCount || 0);
        setUserCount(userCount || 0);
        setOrderCount(orderCount || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex items-center h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Body */}
      <div className="h-full w-full border bg-slate-100 p-9">
        <div className="h-full w-full shadow-lg rounded-sm bg-white p-10">
          <h1 className="mb-16 text-4xl font-semibold">Hi Admin 👋</h1>
          <div className="w-full flex justify-center items-center gap-5">
            <div className="w-1/4 h-52 rounded-sm bg-slate-50 shadow-lg">
              <h1 className="text-center mb-5 mt-5 text-2xl font-semibold">
                Total categories
              </h1>
              <h1 className="text-center text-5xl font-semibold">
                {categoryCount}x
              </h1>
            </div>
            <div className="w-1/4 h-52 rounded-sm bg-slate-50 shadow-lg">
              <h1 className="text-center mb-5 mt-5 text-2xl font-semibold">
                Products
              </h1>
              <h1 className="text-center text-5xl font-semibold">
                {productCount}x
              </h1>
            </div>
            <div className="w-1/4 h-52 rounded-sm bg-slate-50 shadow-lg">
              <h1 className="text-center mb-5 mt-5 text-2xl font-semibold">
                Users
              </h1>
              <h1 className="text-center text-5xl font-semibold">
                {userCount}x
              </h1>
            </div>
            <div className="w-1/4 h-52 rounded-sm bg-slate-50 shadow-lg">
              <h1 className="text-center mb-5 mt-5 text-2xl font-semibold">
                Orders
              </h1>
              <h1 className="text-center text-5xl font-semibold">
                {orderCount}x
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
