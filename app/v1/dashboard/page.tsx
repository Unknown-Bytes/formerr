import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "@/components/block/folderIcon";
import FastWidgets from "./fastWidgets";


export default async function Dashboard() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/v1/dashboard");
  }

  function getUserName(username: string) {
    if (!username) {
      return '';
    }
    return username.split(' ')[0] || '';
  }

  const firstName = getUserName(user?.name);

  const image = `https://avatars.githubusercontent.com/u/${user.githubId}`;

  return (
    <div className="flex flex-col w-full h-dvh">
      {/* Saudação */}
      <section className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Olá, {firstName}!</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <p>Total de Formulários</p>
            <span className="text-3xl font-semibold">--</span>
          </div>
          <div className="p-4 border rounded-md">
            <p>Total de Respostas</p>
            <span className="text-3xl font-semibold">--</span>
          </div>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className="p-4">
        <FastWidgets></FastWidgets>
      </section>

      {/* Grade de Outros */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-4">Projetos</h2>
        <div className="grid grid-cols-2 gap-4">
          <FolderIcon></FolderIcon>
        </div>
      </section>

      {/* Dados Resumidos */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-4">Dados Resumidos</h2>
        <div className="p-4 border rounded-md">
          {/* futuro */}
          j
        </div>
      </section>
    </div>
  );
}

