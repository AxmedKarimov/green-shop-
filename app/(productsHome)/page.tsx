"use client";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const supabase = createClient();

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: string;
  name: string;
  categoryId: number;
  description: string;
  price: string;
  images: string[];
  active: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchCategories() {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) console.error(error);
    else setCategories(data);
  }

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("products").select("*").eq("active", true);
    if (selectedCategory !== null) {
      query = query.eq("categoryId", selectedCategory);
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      const filteredProducts = data.map((product) => ({
        ...product,
        images:
          typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images || [],
      }));
      setProducts(filteredProducts);
      countProducts(filteredProducts);
    }
    setLoading(false);
  }

  async function countProducts(allProducts: Product[]) {
    const counts: Record<number, number> = {};
    allProducts.forEach((product) => {
      if (!counts[product.categoryId]) counts[product.categoryId] = 0;
      counts[product.categoryId]++;
    });
    setCategoryCounts(counts);
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-6 gap-6">
      {/* Sidebar */}
      <div className="h-auto md:h-[500px] w-full md:w-[300px] shadow-md border bg-white rounded-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <ul className="mt-4 space-y-3">
          <li
            className={`cursor-pointer text-lg font-medium flex justify-between${
              selectedCategory === null
                ? "text-green-600 flex justify-between"
                : "text-gray-700 flex justify-between"
            } hover:text-green-500`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>All Products </span>
            <span className="text-gray-500">({products.length})</span>
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`flex justify-between items-center cursor-pointer text-lg font-medium ${
                selectedCategory === category.id
                  ? "text-green-600"
                  : "text-gray-700"
              } hover:text-green-500`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span>{category.name}</span>
              <span className="text-gray-500">
                ({categoryCounts[category.id] || 0})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product List */}
      <div className="min-h-[500px] w-full rounded-lg border shadow-md bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "All Products"}
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm animate-pulse bg-gray-200 h-48"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {product.images.length > 0 && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                      width={400}
                      height={250}
                    />
                  )}
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="text-green-600 font-bold">${product.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
