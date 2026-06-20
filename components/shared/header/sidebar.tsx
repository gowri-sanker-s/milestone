"use client";

import {
  BookHeadphones,
  BookUser,
  Headset,
  Home,
  LibraryBig,
  NotebookText,
  Bookmark,
  Sparkles,
  BookOpen,
  Heart,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
const menuItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/books", label: "All Books", icon: LibraryBig },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  {
    href: "/books/genres",
    label: "Browse Books by Genre",
    icon: BookHeadphones,
  },
  { href: "/featured", label: "Featured Books", icon: Sparkles },
  { href: "/new-arrivals", label: "New Arrivals", icon: BookOpen },
  { href: "/best-sellers", label: "Best Sellers", icon: Heart },
  { href: "/combos", label: "Combo Offers", icon: Compass },
  { href: "/books/authors", label: "Browse Books by Author", icon: BookUser },
  { href: "/about-us", label: "About", icon: NotebookText },
  { href: "/contact-us", label: "Contact", icon: Headset },
];

const sidebarVariants: Variants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // ✅ correct
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    x: -40,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Sidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenSidebar(false);
      }
    };

    if (openSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebar]);

  return (
    <div className="">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpenSidebar((prev) => !prev)}
        className="relative w-8 h-8 grid items-center"
      >
        {/* top */}
        <span
          className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "w-7 rotate-45" : "w-8 -translate-y-2"}
    `}
        />

        {/* middle */}
        <span
          className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "opacity-0 scale-x-0" : "w-5"}
    `}
        />

        {/* bottom */}
        <span
          className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "w-7 -rotate-45" : "w-8 translate-y-2"}
    `}
        />
      </button>
      <AnimatePresence>
        {openSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[61.5px] bg-black/20 backdrop-blur-xs z-40"
              onClick={() => setOpenSidebar(false)}
            />
            <motion.aside
              ref={sidebarRef}
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-[61.5px] left-0 z-50 h-full w-full md:w-[40%] lg:w-1/4 bg-primary-border"
            >
            <div className="grid place-items-center py-16">
              <motion.ul className="grid gap-10 text-[15px] sm:text-[16px] lg:text-[18px] font-semibold">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      variants={itemVariants}
                      whileHover={{ x: 6 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpenSidebar(false)}
                        className="flex items-center gap-2 font-normal"
                      >
                        <Icon size={22} strokeWidth={1.5} />
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
