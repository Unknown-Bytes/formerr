import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import { Button } from "@/components/ui/button";


export default async function Page() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }

  const image = `https://avatars.githubusercontent.com/u/${user.githubId}`;
  return (
    <div className="flex flex-col w-full">
      <section className="flex flex-col">
        <div className="flex flex-row justify-between content-center align-middle text-left p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold text-center text-gray-700">
            Dashboard
          </h2>
          <Button className="bg-blue-600">Novo Formulário</Button>
        </div>
      </section>
    </div>
  );
}

