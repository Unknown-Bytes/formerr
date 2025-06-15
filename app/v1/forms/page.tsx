"use client";
import { FolderIcon } from "@/components/block/folderIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Trash2,
  Edit,
  Copy,
  Eye,
  Lock,
  Globe,
  Clock
} from "lucide-react";

// Mock data for forms - replace with real data
const mockForms = [
  {
    id: 1,
    title: "Pesquisa de Satisfação 2024",
    description: "Avaliação da experiência dos clientes",
    responses: 142,
    isPrivate: false,
    createdAt: "2024-06-10",
    updatedAt: "2024-06-14",
    status: "active"
  },
  {
    id: 2,
    title: "Feedback de Produto",
    description: "Coleta de opiniões sobre novos recursos",
    responses: 67,
    isPrivate: true,
    createdAt: "2024-06-05",
    updatedAt: "2024-06-13",
    status: "active"
  },
  {
    id: 3,
    title: "Cadastro de Participantes",
    description: "Registro para evento técnico",
    responses: 28,
    isPrivate: false,
    createdAt: "2024-06-01",
    updatedAt: "2024-06-12",
    status: "draft"
  },
  {
    id: 4,
    title: "Avaliação de Treinamento",
    description: "Feedback sobre sessão de capacitação",
    responses: 95,
    isPrivate: true,
    createdAt: "2024-05-28",
    updatedAt: "2024-06-11",
    status: "closed"
  }
];

const FormCard = ({ form }: { form: any }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'closed':
        return 'Fechado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-900 transition-colors">
              {form.title}
            </h3>
            <p className="text-sm text-gray-600 truncate mt-0.5">
              {form.description}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Copy className="w-4 h-4" />
                  Duplicar
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <BarChart3 className="w-4 h-4" />
                  Relatórios
                </button>
                <hr className="my-1" />
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{form.responses} respostas</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              {form.isPrivate ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Privado</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Público</span>
                </>
              )}
            </div>
          </div>
          
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}>
            {getStatusLabel(form.status)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Criado em {new Date(form.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Atualizado em {new Date(form.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Forms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || form.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Meus Formulários
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Gerencie todos os seus formulários em um só lugar
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => window.location.href = "/v1/forms/new"}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Formulário
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Formulários</p>
                  <p className="text-2xl font-bold text-gray-900">{mockForms.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Respostas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockForms.reduce((sum, form) => sum + form.responses, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rascunhos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockForms.filter(form => form.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockForms.filter(form => form.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar formulários..."
                  className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  className="h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativos</option>
                  <option value="draft">Rascunhos</option>
                  <option value="closed">Fechados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forms Grid */}
          <div className="space-y-6">
            {filteredForms.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || filterStatus !== "all" 
                    ? "Nenhum formulário encontrado" 
                    : "Nenhum formulário criado ainda"
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                    : "Comece criando seu primeiro formulário para coletar informações"
                  }
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = "/v1/forms/new"}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Formulário
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {filteredForms.length} de {mockForms.length} formulários
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredForms.map((form) => (
                    <FormCard key={form.id} form={form} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}