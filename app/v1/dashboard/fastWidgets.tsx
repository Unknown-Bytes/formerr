"use client"

export default function FastWidgets() {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
            <div className="flex gap-4">
                <div className="p-4 border rounded-md flex-1 text-center"
                    onClick={() => (window.location.href = '/v1/forms')}
                >
                    Criar Formulário
                </div>
                <div className="p-4 border rounded-md flex-1 text-center">
                    Ver Respostas
                </div>
                <div className="p-4 border rounded-md flex-1 text-center">
                    Configurar
                </div>
            </div>
        </div>
    )
}