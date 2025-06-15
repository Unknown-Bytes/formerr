import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/lib/server/request";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "@/components/block/folderIcon";
import FastWidgets from "./fastWidgets";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  BarChart3
} from "lucide-react";

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

  // Get current time info
  const now = new Date();
  const hour = now.getHours();
  const getGreeting = () => {
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header com Saudação */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Avatar do usuário */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src={image} 
                  alt={`Avatar de ${firstName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Bem-vindo ao seu painel de controle
                </p>
              </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Formulários</p>
                    <span className="text-3xl font-bold text-gray-900">--</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
                    <span className="text-3xl font-bold text-gray-900">--</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                    <span className="text-3xl font-bold text-gray-900">--</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Este Mês</p>
                    <span className="text-3xl font-bold text-gray-900">--</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ações Rápidas */}
          <section>
            <FastWidgets />
          </section>

          {/* Grade de Projetos com FolderIcon */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Projetos</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <FolderIcon />
                {/* Adicione mais FolderIcons conforme necessário */}
              </div>
            </div>
          </section>

          {/* Dados Resumidos */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Dados Resumidos</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Dados em breve...</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}