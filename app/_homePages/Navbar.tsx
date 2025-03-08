"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { createClient } from "@/supabase/client";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      fetchUserName(userToken);
    }
    fetchCartCount();
  }, []);

  const fetchUserName = async (userToken: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("token", userToken)
      .single();

    if (error) {
      console.error("Foydalanuvchi topilmadi:", error);
    } else {
      setUsername(data.name);
    }
  };

  const fetchCartCount = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const { data, error } = await supabase
      .from("cartt")
      .select("id")
      .eq("user_id", userId);

    if (error) {
      console.error("Savatcha ma'lumotlarini olishda xatolik:", error);
      return;
    }

    setCartCount(data.length);
  };

  return (
    <div className="w-full h-[85px] flex justify-center items-center pt-3 mb-[29px] shadow-md p-3 mt-3 rounded-xl">
      <div className="w-full h-full flex justify-between items-center">
        <img
          onClick={() => router.push("/")}
          className="w-18 h-full rounded-full shadow-sm cursor-pointer"
          src="/logo (2).webp"
          alt="Logo"
        />

        <div className="flex justify-around items-center gap-5 relative">
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <GiShoppingCart className="size-10" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          {username ? (
            <div className=" items-center gap-3">
              <div
                onClick={() => router.push("/cabinet")}
                className="w-[50px] h-[50px]  bg-red-500 text-white rounded-full cursor-pointer"
              >
                <img src="/avatar.jpg" alt="" />
              </div>
              {username}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-[100px] h-[35px] rounded-md bg-[#46A358] text-white"
            >
              Login {"->"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
