"use client";

import Sidebar from "./saidbar";

export default function AdminPage() {
  return (
    <div className="w-full flex items-center h-screen">
      {/* saidbar */}
      <Sidebar />
      {/* body */}

      <div className="h-full w-full border "></div>
    </div>
  );
}
