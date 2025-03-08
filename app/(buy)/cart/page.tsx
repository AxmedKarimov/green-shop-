"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState } from "react";
import Navbar from "../../_homePages/Navbar";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  categoryId: number;
  description: string;
  price: string;
  images: string[];
  active: boolean;
}

interface CartItem {
  id: number;
  product_id: string;
  count: number;
  totalPrice: string;
  user_id: string;
  product?: Product;
}

export default function Page() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ticketData = localStorage.getItem("user_id");
    if (ticketData) {
      try {
        const parsedUserId = JSON.parse(ticketData);
        setUserId(typeof parsedUserId === "string" ? parsedUserId : null);
      } catch (error) {
        setUserId(ticketData);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      setLoading(true);

      const { data: cartData, error: cartError } = await supabase
        .from("cartt")
        .select("*")
        .eq("user_id", userId);

      if (cartError) {
        toast.error("Error fetching cart items");
        setLoading(false);
        return;
      }

      if (!cartData || cartData.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = cartData.map((item) => item.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) {
        toast.error("Error fetching products");
        setLoading(false);
        return;
      }

      const enrichedCartItems = cartData.map((cartItem) => ({
        ...cartItem,
        product: productsData.find((p) => p.id === cartItem.product_id) || null,
      }));

      setCartItems(enrichedCartItems);
      setLoading(false);
    };

    fetchCartItems();
  }, [userId]);

  const removeCartItem = async (id: number) => {
    const { error } = await supabase.from("cartt").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting item");
      return;
    }
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleGOchek = () => {
    // Store the total price in local storage
    const totalPrice = cartItems
      .reduce((acc, item) => acc + parseFloat(item.totalPrice), 0)
      .toFixed(2);
    localStorage.setItem("totalPrice", totalPrice);
    router.push("/checkout");
  };

  return (
    <div className="w-full px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <Navbar />
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
          <div className="hidden md:grid grid-cols-5 gap-4 border-b pb-2 font-semibold">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Action</div>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b py-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.product?.images?.[0] || "/placeholder.jpg"}
                    alt={item.product?.name || "Unknown Product"}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.product?.name || "Unknown"}
                    </h2>
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  ${parseFloat(item.product?.price || "0").toFixed(2)}
                </div>
                <div className="text-lg font-semibold">{item.count}</div>
                <div className="text-lg font-semibold">
                  ${parseFloat(item.totalPrice).toFixed(2)}
                </div>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Your cart is empty.
            </p>
          )}
          <div className="text-xl font-bold mt-6 text-right">
            Total:{" "}
            <span className="text-green-600">
              $
              {cartItems
                .reduce((acc, item) => acc + parseFloat(item.totalPrice), 0)
                .toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => handleGOchek()}
            className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg hover:bg-green-700 transition"
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
