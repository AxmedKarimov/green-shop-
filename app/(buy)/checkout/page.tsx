"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { toast } from "react-hot-toast";
import Navbar from "@/app/_homePages/Navbar";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    country: "",
    email: "",
    city: "",
    phone: "",
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedTotalPrice = localStorage.getItem("totalPrice");

    if (storedUserId) setUserId(storedUserId);
    if (storedTotalPrice) setTotalPrice(storedTotalPrice);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    Object.values(formData).every((val) => val.trim() !== "") &&
    userId &&
    totalPrice;

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.from("orders").insert([
      {
        userId,
        totalPrice: parseFloat(totalPrice),
        name: formData.name,
        lastName: formData.lastname,
        country: formData.country,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        status: "OPEN",
        createdAt: new Date(),
      },
    ]);

    if (error) {
      console.error("Error saving order:", error.message);
      toast.error("Buyurtma saqlashda xatolik yuz berdi!");
      setLoading(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("cartt")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting cart items:", deleteError.message);
      toast.error("Cartt ma'lumotlarini o'chirishda xatolik yuz berdi!");
    } else {
      toast.success("Buyurtma muvaffaqiyatli saqlandi va savat tozalandi!");

      localStorage.removeItem("cart");
      localStorage.removeItem("totalPrice");

      setFormData({
        name: "",
        lastname: "",
        country: "",
        email: "",
        city: "",
        phone: "",
      });
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="w-[1200px] mx-auto">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p className="mt-2 text-gray-700">
              <strong>Total Price:</strong> ${totalPrice || "0.00"}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className={`w-full py-3 mt-6 rounded-lg ${
              isFormValid && !loading
                ? "bg-green-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
