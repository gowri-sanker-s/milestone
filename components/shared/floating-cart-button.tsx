"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { getMyCart } from "@/lib/actions/cart.action";

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  image: string;
}

const FloatingCartButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [bounceKey, setBounceKey] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isFetched = useRef(false);

  // Function to fetch cart count
  const fetchCartCount = async () => {
    try {
      const cart = await getMyCart();
      if (cart && cart.items) {
        const count = cart.items.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(count);
        setIsVisible(count > 0 && pathname !== "/cart");
      } else {
        setCartCount(0);
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // Initial fetch and setup event listeners
  useEffect(() => {
    fetchCartCount();

    const handleCartUpdated = () => {
      fetchCartCount();
    };

    const handleFlyingItem = (e: Event) => {
      const customEvent = e as CustomEvent<{
        startX: number;
        startY: number;
        image: string;
      }>;
      const { startX, startY, image } = customEvent.detail;

      const newItem: FlyingItem = {
        id: Math.random().toString(36).substring(2, 9),
        startX,
        startY,
        image: image || "/placeholder-book.jpg",
      };

      setFlyingItems((prev) => [...prev, newItem]);
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("cart-item-flying", handleFlyingItem);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("cart-item-flying", handleFlyingItem);
    };
  }, [pathname]);

  // Handle visibility based on route changes
  useEffect(() => {
    if (pathname === "/cart") {
      setIsVisible(false);
    } else if (cartCount > 0) {
      setIsVisible(true);
    }
  }, [pathname, cartCount]);

  // Transition variants for the main cart button sliding in/out
  const buttonVariants = {
    hidden: {
      x: 100,
      y: 300,
      opacity: 0,
      scale: 0.3,
      rotate: 45,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 14,
      },
    },
    exit: {
      x: 100,
      y: 300,
      opacity: 0,
      scale: 0.3,
      rotate: 45,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };


  const handleItemArrival = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    setBounceKey((prev) => prev + 1);
    fetchCartCount(); // Refresh count to reflect newly arrived item
  };

  return (
    <>
      {/* ── Dynamic Flying Items Layer ── */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              left: item.startX,
              top: item.startY,
              width: 90,
              height: 130,
              opacity: 1,
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
              zIndex: 9999,
              pointerEvents: "none",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              left: window.innerWidth - 55,
              top: window.innerHeight / 2 - 25,
              width: 20,
              height: 28,
              opacity: 0.3,
              scale: 0.2,
              rotate: 540,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.25, 0.8, 0.25, 1], // beautiful smooth curve
            }}
            onAnimationComplete={() => handleItemArrival(item.id)}
            className="overflow-hidden bg-primary-border border border-primary-text/10"
          >
            <img
              src={item.image}
              alt="Flying book"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Floating Cart Button ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            <motion.button
              key={bounceKey}
              animate={
                bounceKey > 0
                  ? {
                      scale: [1, 1.3, 0.85, 1.1, 1],
                      rotate: [0, 8, -8, 3, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => router.push("/cart")}
              className="bg-primary-text text-primary-bg rounded-l-full py-4 pl-5 pr-4 border-l border-y border-primary-border/20 shadow-[0_10px_30px_rgba(68,41,23,0.35)] flex items-center justify-center relative group cursor-pointer hover:pl-7 transition-all duration-300 active:scale-95"
              title="View Cart"
            >
              <ShoppingCart className="w-7 h-7 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />

              {/* Dynamic popping count badge */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-1.5 -left-1.5 bg-[#b04a26] text-white text-[11px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_2px_8px_rgba(176,74,38,0.5)] border-2 border-primary-bg"
                >
                  {cartCount}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCartButton;
