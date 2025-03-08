"use client";
import Link from "next/link";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdProductionQuantityLimits,
} from "react-icons/md";
import Sidebar from "../saidbar";
import { createClient } from "@/supabase/client";

interface Category {
  id: number;
  name: string;
  active: boolean;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryActive, setNewCategoryActive] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const supabase = createClient();
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data as Category[]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("categories")
      .insert({ name: newCategoryName, active: newCategoryActive });
    if (error) {
      console.error("Error adding category:", error);
    } else {
      setNewCategoryName("");
      setNewCategoryActive(true);
      setShowAddModal(false);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting category:", error);
    } else {
      fetchCategories();
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const { error } = await supabase
      .from("categories")
      .update({
        name: editingCategory.name,
        active: editingCategory.active,
      })
      .eq("id", editingCategory.id);
    if (error) {
      console.error("Error updating category:", error);
    } else {
      setEditingCategory(null);
      setShowEditModal(false);
      fetchCategories();
    }
  };

  const handleEditNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, name: e.target.value });
    }
  };

  const handleEditActiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        active: e.target.checked,
      });
    }
  };

  return (
    <div className="w-full flex items-center h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Body */}
      <div className="h-full w-full border p-10 bg-slate-100 overflow-auto">
        <div className="h-full w-full bg-white rounded-lg p-5">
          <div className="flex justify-between items-center w-full mb-10">
            <h1 className="text-4xl font-semibold mt-6 ms-6">Categories</h1>
            <button
              className="bg-[#46A358] text-decoration-none text-white p-3 rounded-lg"
              onClick={() => setShowAddModal(true)}
            >
              Add Category
            </button>
          </div>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="border p-3">ID</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Active</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100">
                  <td className="border p-3 text-center">{category.id}</td>
                  <td className="border p-3">{category.name}</td>
                  <td className="border p-3 text-center">
                    {category.active ? "Yes" : "No"}
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
                      onClick={() => handleEditClick(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteCategory(category.id)}
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
      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  className="mr-2"
                  checked={newCategoryActive}
                  onChange={(e) => setNewCategoryActive(e.target.checked)}
                />
                <label htmlFor="active">Active</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => setShowAddModal(false)}
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
      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl mb-4">Edit Category</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={editingCategory.name}
                  onChange={handleEditNameChange}
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="editActive"
                  className="mr-2"
                  checked={editingCategory.active}
                  onChange={handleEditActiveChange}
                />
                <label htmlFor="editActive">Active</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
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
