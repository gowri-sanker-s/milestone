import React, { Suspense } from "react";
import StateToggle from "./toggle";
import { TABS } from "./constants";
import Profile from "./profile";
import Orders from "./orders";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Main Server Component for User Route
const UserPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const tabParam = typeof params.tab === "string" ? params.tab : undefined;

  // Validate if the tab is in our predefined list, fallback to profile
  const activeTab = TABS.some((t: { id: string }) => t.id === tabParam)
    ? tabParam
    : "profile";

  return (
    <div className="wrapper pt-10">
      <div>
        <h1 className="text-3xl font-bold  mb-6">Account</h1>
        <Suspense
          fallback={
            <div className="h-12 bg-primary-border animate-pulse rounded-xl w-48"></div>
          }
        >
          <StateToggle />
        </Suspense>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "profile" && <Profile />}
        {activeTab === "orders" && <Orders searchParams={searchParams} />}
        {/* Additional components can be added here matching the items in TABS */}
      </div>
    </div>
  );
};

export default UserPage;
