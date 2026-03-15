"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOutUser } from "@/lib/actions/user.action";

const UserDropdown = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstInitial = user?.name?.charAt(0).toUpperCase() ?? "U";

  // Handle open/close with animation timing
  const handleToggle = () => {
    if (open) {
      setVisible(false);
      setTimeout(() => setOpen(false), 250); // wait for slide-out to finish
    } else {
      setOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true)); // trigger enter animation
      });
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
        setTimeout(() => setOpen(false), 250);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={handleToggle}
        className="bg-primary-text p-1 px-3 rounded-xl text-primary-bg font-semibold text-[20px]"
      >
        {firstInitial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border p-3 overflow-hidden"
          style={{
            transform: visible ? "translateX(0)" : "translateX(100%)",
            opacity: visible ? 1 : 0,
            transition:
              "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease",
          }}
        >
          <div className="mb-2">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <form action={signOutUser}>
            <button
              type="submit"
              className="w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
