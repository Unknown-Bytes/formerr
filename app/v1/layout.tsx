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
    <div className="flex flex-col-reverse md:flex-row w-full h-dvh">
      {/* Sidebar pra PC e Tablet */}
      <div className="hidden md:block lg:w-2/10 md:w-3/10 bg-black h-dvh">
        {/* aqui você consegue usar um <Sidebar /> também, se quiser */}
      </div>

      {/* Conteúdo principal */}
      <section className="flex-1">
        {children}
      </section>

      {/* Navbar pra Mobile */}
      <div className="fixed bottom-0 left-0 right-0 block md:hidden dark:bg-black bg-gray-100 w-full border-t dark:border-gray-800">
        <MobileNav image={image} />
      </div>
    </div>
  )
}