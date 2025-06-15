import { FolderIcon } from "@/components/block/folderIcon";
import { Button } from "@/components/ui/button";

export default function Forms() {
    return (
        <div className="flex flex-col w-full h-dvh p-4">
            <section className="pl-4 pr-4 pt-2 pb-2">
                <Button size="lg" className="w-full">Criar Formulário</Button>
            </section>
            {/* Meus Formulários */}
            <section className="p-4">
                <h2 className="text-lg font-semibold mb-4">Meus Formulários</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FolderIcon></FolderIcon>
                </div>
            </section>
        </div>
    )
}