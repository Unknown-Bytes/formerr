"use client"
import { 
  Plus, 
  BarChart3, 
  Settings, 
  FileText,
  Users,
  Zap
} from "lucide-react";

export default function FastWidgets() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200"
                    onClick={() => (window.location.href = '/v1/forms')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                Criar Formulário
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Configure um novo formulário
                            </p>
                        </div>
                    </div>
                </div>

                <div 
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-sm cursor-pointer transition-all duration-200"
                    onClick={() => {/* Adicionar navegação para respostas */}}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-900 transition-colors">
                                Ver Respostas
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Analise dados coletados
                            </p>
                        </div>
                    </div>
                </div>

                <div 
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all duration-200"
                    onClick={() => {/* Adicionar navegação para configurações */}}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                                Configurar
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Ajuste suas preferências
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}