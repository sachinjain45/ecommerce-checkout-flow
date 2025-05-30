"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="text-center mt-5">
      <h1>Welcome to the E-commerce App</h1>
      <p className="mt-3">
        This is a simple e-commerce application built with Next.js.
      </p>
      <p className="mt-3">Explore the products and make your purchase!</p>
      <button
        className="mt-5 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        onClick={() => router.push("/landing")}
      >
        Landing Page
      </button>
    </div>
  );
}
