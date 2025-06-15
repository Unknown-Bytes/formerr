import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import { MobileNav } from "@/components/block/MobileNav";

import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren<{}>) {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  
  const image = `https://avatars.githubusercontent.com/u/${user.githubId}`;

  return (
    <div className="flex flex-col h-dvh w-full">
      {/* Main content area with proper spacing for mobile nav */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop and Tablet */}
        <div className="hidden md:block lg:w-2/10 md:w-3/10 bg-black h-full overflow-y-auto">
          {/* Sidebar content can go here */}
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto md:pb-0">
          {children}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="block left-0 right-0 z-50 md:hidden dark:bg-black/95 bg-gray-100/95 backdrop-blur-sm border-t dark:border-gray-800 h-fit">
        <MobileNav image={image} />
      </div>
    </div>
  )
}