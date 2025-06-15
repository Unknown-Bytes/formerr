import { FolderIcon } from "@/components/block/folderIcon"

export default async function Page() {
    return (
        <div className="flex flex-col w-full">
            {/* Saudação */}
            <section className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Olá, Nome!</h1>
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
                <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
                <div className="flex gap-4">
                    <div className="p-4 border rounded-md flex-1 text-center">
                        Criar Formulário
                    </div>
                    <div className="p-4 border rounded-md flex-1 text-center">
                        Ver Respostas
                    </div>
                    <div className="p-4 border rounded-md flex-1 text-center">
                        Configurar
                    </div>
                </div>
            </section>

            {/* Grade de Outros */}
            <section className="p-4">
                <h2 className="text-lg font-semibold mb-4">Outros</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FolderIcon></FolderIcon>
                </div>
            </section>

            {/* Dados Resumidos */}
            <section className="p-4">
                <h2 className="text-lg font-semibold mb-4">Dados Resumidos</h2>
                <div className="p-4 border rounded-md">
                    {/* futuro */}
                </div>
            </section>
        </div>
    )
}