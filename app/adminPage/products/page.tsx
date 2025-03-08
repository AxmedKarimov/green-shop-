"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import { MdAddPhotoAlternate } from "react-icons/md";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  price: number;
  active: boolean;
  images?: string[];
  categories?: Category | null;
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Strings: string[] = [];
  for (const file of files) {
    try {
      const base64 = await convertFileToBase64(file);
      base64Strings.push(base64);
    } catch (error) {
      console.error("Faylni base64 ga aylantirishda xatolik:", error);
    }
  }
  return base64Strings;
};

export default function Products() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductCategoryId, setNewProductCategoryId] = useState<number>(0);
  const [newProductDescription, setNewProductDescription] =
    useState<string>("");
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductActive, setNewProductActive] = useState<boolean>(true);

  const [newProductImages, setNewProductImages] = useState<File[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [editingNewImages, setEditingNewImages] = useState<File[]>([]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories (name)");
      if (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
      } else if (data) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error("fetchProducts error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Kategoriyalarni olishda xatolik:", error);
      } else if (data) {
        setCategories(data as Category[]);
        if (data.length > 0) {
          setNewProductCategoryId(data[0].id);
        }
      }
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let base64Images: string[] = [];
      if (newProductImages.length > 0) {
        base64Images = await convertFilesToBase64(newProductImages);
      }

      const { error } = await supabase.from("products").insert({
        name: newProductName,
        categoryId: newProductCategoryId,
        description: newProductDescription,
        price: newProductPrice,
        active: newProductActive,
        images: base64Images,
      });

      if (error) {
        console.error("Mahsulot qoshishda xatolik:", error);
      } else {
        setNewProductName("");
        setNewProductDescription("");
        setNewProductPrice(0);
        setNewProductActive(true);
        setNewProductImages([]);
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error("handleAddProduct error:", err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Ushbu mahsulotni ochirmoqchimisiz?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Mahsulotni ochirishda xatolik:", error);
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error("handleDeleteProduct error:", err);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditingNewImages([]);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      let newBase64Images: string[] = [];
      if (editingNewImages.length > 0) {
        newBase64Images = await convertFilesToBase64(editingNewImages);
      }

      const oldImages = editingProduct.images || [];
      const updatedImages = [...oldImages, ...newBase64Images];

      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          categoryId: editingProduct.categoryId,
          description: editingProduct.description,
          price: editingProduct.price,
          active: editingProduct.active,
          images: updatedImages,
        })
        .eq("id", editingProduct.id);

      if (error) {
        console.error("Mahsulotni yangilashda xatolik:", error);
      } else {
        setEditingProduct(null);
        setEditingNewImages([]);
        setShowEditModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error("handleUpdateProduct error:", err);
    }
  };
  const handleEditFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (editingProduct) {
      const { name, type } = e.target;
      let newValue: string | number | boolean;

      if (type === "checkbox") {
        newValue = (e.target as HTMLInputElement).checked; // Type assertion for checkbox
      } else if (type === "number") {
        newValue = Number((e.target as HTMLInputElement).value); // Type assertion for number
      } else {
        newValue = (e.target as HTMLInputElement).value; // Default to string for text/textarea/select
      }

      setEditingProduct((prev) => ({
        ...prev!,
        [name]: newValue,
      }));
    }
  };

  const handleNewImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    if (target.files) {
      setNewProductImages((prev) => [...prev, ...Array.from(target.files!)]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    if (target.files) {
      setEditingNewImages((prev) => [...prev, ...Array.from(target.files!)]);
    }
  };

  const handleRemoveEditingNewImage = (index: number) => {
    setEditingNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    if (editingProduct && editingProduct.images) {
      const updated = [...editingProduct.images];
      updated.splice(index, 1);
      setEditingProduct((prev) => ({
        ...prev!,
        images: updated,
      }));
    }
  };
  return (
    <div className="w-full flex items-center h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* BODY */}
      <div className="h-full w-full border bg-slate-100 p-10">
        <div className="h-full w-full bg-white rounded-lg p-5 shadow-sm">
          <div className="w-full flex justify-between items-center mb-5">
            <h1 className="text-4xl font-semibold ms-5 mt-5">Products</h1>
            <button
              className="bg-[#46A358] text-white p-2 rounded-lg ms-5"
              onClick={() => setShowAddModal(true)}
            >
              Add New Product
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by title"
            className="border border-gray-300 rounded-lg p-2 w-1/4 ms-5 text-black outline-none mb-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 shadow-sm">
              <thead className="bg-green-200">
                <tr>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Images</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Description</th>
                  <th className="border p-3">Price</th>
                  <th className="border p-3">Active</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border p-3 text-center">{product.id}</td>
                    <td className="border p-3 text-center">
                      {product.images && product.images.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto max-w-[300px] mx-auto">
                          {product.images.map((imgStr, idx) => (
                            <Image
                              key={idx}
                              src={imgStr}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-cover border border-gray-200 rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        "No Images"
                      )}
                    </td>
                    <td className="border p-3">{product.name}</td>
                    <td className="border p-3 text-center">
                      {product.categories?.name || "N/A"}
                    </td>
                    <td className="border p-3">{product.description}</td>
                    <td className="border p-3 text-center">{product.price}</td>
                    <td className="border p-3 text-center">
                      {product.active ? "Yes" : "No"}
                    </td>
                    <td className="border p-3 text-center space-x-2 flex items-center justify-center">
                      <button
                        className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-auto">
            <h2 className="text-2xl mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newProductCategoryId}
                  onChange={(e) =>
                    setNewProductCategoryId(Number(e.target.value))
                  }
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="newActive"
                  className="mr-2"
                  checked={newProductActive}
                  onChange={(e) => setNewProductActive(e.target.checked)}
                />
                <label htmlFor="newActive">Active</label>
              </div>

              <div className="mb-4">
                <label className="block mb-1">Images</label>
                <label htmlFor="addImg">
                  <div className="w-14 h-14 p-2 rounded-lg border-black border flex items-center justify-center">
                    <MdAddPhotoAlternate className="h-full w-full" />
                  </div>
                  <input
                    id="addImg"
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImagesChange}
                  />
                </label>
              </div>
              {newProductImages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {newProductImages.map((file, idx) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative">
                        <Image
                          src={objectUrl}
                          alt="preview"
                          width={64}
                          height={64}
                          className="object-cover border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                          onClick={() => handleRemoveNewImage(idx)}
                        >
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProductImages([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#46A358] text-white"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-auto">
            <h2 className="text-2xl mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border p-2 rounded"
                  value={editingProduct.name}
                  onChange={handleEditFieldChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <select
                  name="categoryId"
                  className="w-full border p-2 rounded"
                  value={editingProduct.categoryId}
                  onChange={handleEditFieldChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full border p-2 rounded"
                  value={editingProduct.description}
                  onChange={handleEditFieldChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  className="w-full border p-2 rounded"
                  value={editingProduct.price}
                  onChange={handleEditFieldChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="editActive"
                  className="mr-2"
                  checked={editingProduct.active}
                  onChange={handleEditFieldChange}
                />
                <label htmlFor="editActive">Active</label>
              </div>

              {/* Existing Images */}
              {editingProduct.images && editingProduct.images.length > 0 && (
                <div className="mb-4">
                  <label className="block mb-1">Existing Images</label>
                  <div className="flex flex-wrap gap-3">
                    {editingProduct.images.map((imgStr, idx) => (
                      <div key={idx} className="relative">
                        <Image
                          src={imgStr}
                          alt="Existing"
                          width={64}
                          height={64}
                          className="object-cover border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                          onClick={() => handleRemoveExistingImage(idx)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className="mb-4">
                <label className="block mb-1">Add New Images</label>
                <label htmlFor="newImages">
                  <div className="w-14 h-14 p-2 rounded-lg border-black border flex items-center justify-center">
                    <MdAddPhotoAlternate className="h-full w-full" />
                  </div>
                  <input
                    id="newImages"
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditImagesChange}
                  />
                </label>
              </div>

              {/* New Images Preview */}
              {editingNewImages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {editingNewImages.map((file, idx) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative">
                        <Image
                          src={objectUrl}
                          alt="preview"
                          width={64}
                          height={64}
                          className="object-cover border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                          onClick={() => handleRemoveEditingNewImage(idx)}
                        >
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setEditingNewImages([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
