"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOutUser } from "@/lib/actions/user.action";
import Link from "next/link";
import { Box, LogOut, User } from "lucide-react";

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
          className="absolute right-0 mt-2 w-fit rounded-xl bg-primary-border shadow-md border border-primary-text/10 p-3 px-5 overflow-hidden"
          style={{
            transform: visible ? "translateX(0)" : "translateX(100%)",
            opacity: visible ? 1 : 0,
            transition:
              "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease",
          }}
        >
          <div className="top flex gap-3 items-center pb-3 border-b border-primary-text/10">
            <div className="left shrink-0 h-[40px] w-[40px] rounded-md bg-primary-text text-primary-bg grid place-items-center">
              {user?.image ? <img src={user?.image} alt="" /> : firstInitial}
            </div>
            <div className="right">
              <p className="font-semibold leading-[1]">{user?.name}</p>
              <p className="text-sm leading-[1] opacity-50">{user?.email}</p>
            </div>
          </div>
          <div className="mid py-3">
            <Link
              href="/user/profile"
              className="py-1.5 hover:bg-primary-bg rounded-md px-2 flex! items-center gap-2"
            >
              <span>
                <User size={15} strokeWidth={1.5} />
              </span>
              Profile
            </Link>
            <Link
              href="/user/orders"
              className="py-1.5 hover:bg-primary-bg rounded-md px-2 flex! items-center gap-2"
            >
              <span>
                <Box size={15} strokeWidth={1.5} />
              </span>
              Orders
            </Link>
          </div>
          <div className="bottom border-t border-primary-text/10">
            <div className="py-2">
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="py-1.5 text-red-500 hover:bg-primary-bg rounded-md px-2 flex! items-center gap-2 w-full"
                >
                  <span>
                    <LogOut size={15} strokeWidth={1.5} />
                  </span>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
          {/* <div className="mb-2">
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
          </form> */}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
