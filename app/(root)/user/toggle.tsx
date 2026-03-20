"use client";
import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TABS } from "./constants";
import { funnel } from "@/lib/fonts";

const StateToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    // Use scroll: false to prevent jumping to the top of the page on tab switch
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <div className="flex w-fit">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-10 py-3 mb-5  text-[15px] font-semibold ${funnel.className} ${isActive ? "border-b-2 border-primary-text bg-primary-border/50 rounded-t-2xl  " : "border-b-2 border-transparent"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StateToggle;
