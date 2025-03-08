"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../_homePages/Navbar";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: number;
  createdAt: string;
  phone: string;
  status: string;
  totalPrice: number;
  name: string;
  lastName: string;
  country: string;
  city: string;
  email: string;
}

export default function Cabinet() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("id", userId)
        .single();

      if (userError) console.error("User fetch error:", userError);
      else setUser(userData as User);

      // Fetch orders data
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          "id, createdAt, phone, status, totalPrice, name, lastName, country, city, email"
        )
        .eq("userId", userId);

      if (ordersError) console.error("Orders fetch error:", ordersError);
      else setOrders(ordersData as Order[]);

      setLoading(false); // Set loading to false after both fetches complete
    };

    fetchUserAndOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    router.push("/");
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen py-5">
      <div className="w-[1200px] mx-auto">
        <Navbar />

        {/* User Info Section */}
        {loading ? (
          <div className="p-5 border rounded-lg shadow-md bg-white mt-5 w-1/3 mx-auto animate-pulse">
            <div className="h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 w-1/3 mx-auto"></div>
          </div>
        ) : (
          user && (
            <div className="p-5 border rounded-lg shadow-md bg-white mt-5 w-1/3 mx-auto">
              <h2 className="text-xl font-bold">Foydalanuvchi Ma’lumotlari</h2>
              <img
                src="/avatar.jpg"
                className="w-[105px] h-[105px] mx-auto"
                alt="User Avatar"
              />
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Ism:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Chiqish
              </button>
            </div>
          )
        )}

        {/* Orders Section */}
        <div className="mt-5">
          <h2 className="text-xl font-bold">Buyurtmalar</h2>
          {loading ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-white shadow-md animate-pulse"
                >
                  <div className="h-4 bg-gray-200 w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-3/4 mb-3"></div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 bg-white shadow-md"
                >
                  <p>
                    <strong>Buyurtma ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Yaratilgan:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ism:</strong> {order.name} {order.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Telefon:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Manzil:</strong> {order.city}, {order.country}
                  </p>
                  <p>
                    <strong>Holat:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded ${
                        order.status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Umumiy narx:</strong> ${order.totalPrice}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Hech qanday buyurtma topilmadi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
