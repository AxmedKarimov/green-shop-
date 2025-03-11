"use client";
import Footer from "@/app/_homePages/Footer";
import Navbar from "@/app/_homePages/Navbar";
import { createClient } from "@/supabase/client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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

const supabase = createClient();

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error fetching product details");
        return;
      }
      setProduct(data);
      setSelectedImage(data.images[0]);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.warn("Please log in to add items to cart");
      return;
    }

    const { error } = await supabase.from("cartt").insert({
      user_id: userId,
      product_id: id,
      count,
      totalPrice: parseFloat(product?.price || "0") * count,
    });

    if (error) {
      toast.error("Failed to add to cart");
    } else {
      toast.success("Added to cart successfully!");
    }
  };

  return (
    <div className="w-full">
      <div className="w-[1200px] mx-auto">
        <Navbar />
        <div className="container mx-auto p-4 md:p-8">
          {loading ? (
            <Skeleton height={400} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt={product?.name || "Product image"}
                    width={500}
                    height={500}
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                )}
                <div className="flex gap-2 mt-4">
                  {product?.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      onMouseEnter={() => setSelectedImage(img)}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-green-500"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-semibold">
                  {product?.name || <Skeleton />}
                </h1>
                <p className="text-green-600 text-2xl font-bold mt-2">
                  ${product?.price || <Skeleton />}
                </p>
                <p className="text-gray-600 mt-4">
                  {product?.description || <Skeleton count={3} />}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 px-4 py-2 rounded-md">
                    <button
                      className="text-xl"
                      onClick={() => setCount(count > 1 ? count - 1 : 1)}
                    >
                      -
                    </button>
                    <span className="mx-4 text-lg">{count}</span>
                    <button
                      className="text-xl"
                      onClick={() => setCount(count + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}
