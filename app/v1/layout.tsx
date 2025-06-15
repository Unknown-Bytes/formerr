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


  /*
    <div className="block left-0 right-0 z-50 md:hidden dark:bg-black/95 bg-gray-100/95 backdrop-blur-sm border-t dark:border-gray-800 h-fit">
        <MobileNav image={image} />
      </div>
  */
  return (
    <div className="flex flex-col h-dvh w-full">
      <div className="flex-1 overflow-y-auto md:pb-0">
          {children}
      </div>
    </div>
  )
}