"use client";

import { useEffect, useState } from "react";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";

interface Order {
  id: number;
  name: string;
  lastName: string;
  status: "OPEN" | "INPROGRESS" | "CLOSE";
  totalPrice: number;
  phone: string;
  country: string;
  city: string;
  email: string;
}

export default function Admin() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("orders").select("*");
        if (error) {
          throw new Error(error.message);
        }
        setOrders(data as Order[]);
      } catch (err: any) {
        setError("Error fetching orders: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    id: number,
    newStatus: "OPEN" | "INPROGRESS" | "CLOSE"
  ) => {
    try {
      await supabase.from("orders").update({ status: newStatus }).eq("id", id);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDragStart = (event: React.DragEvent, id: number) => {
    event.dataTransfer.setData("orderId", id.toString());
  };

  const handleDrop = (
    event: React.DragEvent,
    newStatus: "OPEN" | "INPROGRESS" | "CLOSE"
  ) => {
    const id = Number(event.dataTransfer.getData("orderId"));
    updateOrderStatus(id, newStatus);
  };

  return (
    <div className="w-full flex items-center h-screen bg-gray-200">
      <Sidebar />
      <div className="h-full w-full bg-slate-100 p-10 flex flex-col items-center">
        <div className="h-full w-full max-w-6xl bg-white rounded-lg p-10 shadow-2xl">
          <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">
            Orders
          </h1>
          {loading ? (
            <p className="text-center text-xl text-gray-600">
              Loading orders...
            </p>
          ) : error ? (
            <p className="text-center text-xl text-red-500">{error}</p>
          ) : (
            <div className="flex justify-center items-start gap-10">
              {["OPEN", "INPROGRESS", "CLOSE"].map((status) => (
                <div
                  key={status}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    handleDrop(e, status as "OPEN" | "INPROGRESS" | "CLOSE")
                  }
                  className="bg-white rounded-lg p-6 w-[350px] border h-[550px] shadow-xl overflow-auto transition-all duration-300 ease-in-out hover:shadow-2xl"
                >
                  <h1 className="text-3xl font-semibold mb-5 w-full text-center text-gray-700 uppercase border-b pb-3">
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </h1>
                  {orders
                    .filter((order) => order.status === status)
                    .map((order) => (
                      <div
                        key={order.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        className="mb-5 p-4 border rounded-lg shadow-sm bg-gray-50 cursor-move transition-transform transform hover:scale-105"
                      >
                        <h2 className="text-lg font-bold text-gray-800">
                          Order ID: {order.id}
                        </h2>
                        <p className="text-gray-600 font-medium">
                          {order.name} {order.lastName}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Phone: {order.phone}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Email: {order.email}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Location: {order.city}, {order.country}
                        </p>
                        <p className="mt-2 font-bold text-blue-600">
                          Total: {order.totalPrice} UZS
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
