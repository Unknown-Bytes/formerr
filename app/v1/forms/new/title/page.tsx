"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNewForm } from "../formcontext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Forms() {
  const { newForm, setNewForm } = useNewForm();

  // Validações
  const isTitleValid = newForm?.title?.trim?.() !== '' && newForm?.title?.trim?.().length > 0;
  const isPrivateValid = !newForm?.private ||
    (newForm?.private && newForm?.allowedEmails?.length > 0);
  
  const isFormValid = isTitleValid && isPrivateValid;

  // Mensagens de erro
  const [errors, setErrors] = React.useState<{ title: string; private?: string }>({ title: '' });

  const handleSubmit = () => {
    if (!isFormValid) {
      if (!isTitleValid) {
        setErrors((prev) => ({ ...prev, title: 'Título é obrigatório.' }))
      }
      if (newForm?.private && newForm?.allowedEmails?.length === 0) {
        setErrors((prev) => ({ ...prev, private: 'Adicione pelo menos um e-mail para o formulário privado.' }))
      }
      return;
    }
    // Se tudo estiver válido, segue pra próxima
    window.location.href = "/v1/forms/new/questions";
  }

  return (
    <div>
      <section>
        <div className="p-4 mt-4">
          <h2 className="text-2xl text-black font-bold">
            Novo formulário
          </h2>
          <p className="text-sm text-muted-foreground">
            Criando os preparativos para seu formulário
          </p>
        </div>

        {/* Título */}
        <div className="p-4 mb-4 mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              <p>Qual o nome desse formulário? *</p>
            </Label>
            <Input
              className="p-6"
              id="title"
              name="title"
              placeholder="Informe o nome do formulário"
              required
              aria-required
              value={newForm?.title || ""}
              onChange={(e) => {
                setNewForm({ ...newForm, title: e.target.value })
                setErrors((prev) => ({ ...prev, title: '' }))
              }}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          {/* Descrição */}
          <div className="grid gap-2">
            <Label htmlFor="description">
              <p>Qual a descrição desse formulário?</p>
            </Label>
            <Input
              className="p-6"
              id="description"
              name="description"
              placeholder="Informe uma descrição (opcional)"
              aria-required="false"
              value={newForm?.description || ""}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
            />
          </div>

          {/* Máximo de respostas */}
          <div className="flex-col mt-4 p-4 grid gap-2">
            <Label htmlFor="maxResponses">
              Quantidade Máxima de Respostas (opcional)
            </Label>
            <Input
              id="maxResponses"
              name="maxResponses"
              type="number"
              min="1"
              value={(newForm as any).maxResponses || ""}
              onChange={(e) =>
                setNewForm({ ...newForm, maxResponses: parseInt(e.target.value, 10) })
              }
              placeholder="Deixe vazio para ilimitado"
            />
          </div>

          {/* Visibilidade */}
          <div className="space-y-4 p-4">
            <Label>Visibilidade *</Label>
            <RadioGroup
              value={newForm?.private ? "private" : "public"}
              onValueChange={(value) => {
                if (value === "private") {
                   setNewForm({ ...newForm, private: true, allowedEmails: [] });
                } else {
                   setNewForm({ ...newForm, private: false, allowedEmails: [], maxResponses: 0 });
                }
              }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">
                   Público - qualquer pessoa consegue responder
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">
                   Privado - Apenas pessoas autorizadas
                </Label>
              </div>
            </RadioGroup>

            {/* E-mail privado */}
            {newForm?.private && (
              <div className="space-y-2 mt-4 transition-all">
                <div className="flex gap-2">
                   <div className="flex-1">
                      <Input
                         id="email"
                         name="email"
                         type="email"
                         placeholder="Informe o e-mail autorizado"
                      />
                   </div>
                   <button
                     type="button"
                     onClick={(e) => {
                       const input = document.querySelector("#email") as HTMLInputElement;
                       if (input && input.value) {
                         setNewForm({ 
                           ...newForm, 
                           allowedEmails: [...newForm.allowedEmails, input.value] 
                         });
                         input.value = '';
                         setErrors((prev) => ({ ...prev, private: '' }))
                       }
                     }}
                     className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                   >
                     Adicionar
                   </button>
                 </div>

                 {newForm?.allowedEmails?.length > 0 && (
                   <div className="mt-2 space-y-1">
                     {newForm.allowedEmails?.map((email, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                         <span className="text-sm">{email}</span>
                         <button
                           type="button"
                           onClick={() => {
                             setNewForm({ 
                                ...newForm, 
                                allowedEmails: newForm.allowedEmails?.filter((_, i) => i !== idx) 
                             })
                           }}
                           className="text-muted-foreground hover:text-foreground"
                         >
                           ×
                         </button>
                       </div>
                     ))}
                   </div>
                 )}

                 {errors.private && <span className="text-red-500 text-sm">{errors.private}</span>}
               </div>
            )}

          </div>

          {/* Ações */}
          <div className="p-4">
            <Button
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="p-2 w-full h-full"
              variant="default"
            >
              Continuar
            </Button>
          </div>

        </div>
      </section>
    </div>
  )
}