"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNewForm } from "../formcontext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import {
  FileText,
  Users,
  Lock,
  Globe,
  Mail,
  X,
  Plus,
  AlertCircle,
  Settings,
  Info,
  ArrowBigLeft
} from "lucide-react";

// Add id to the form type (you might want to add this to your FormContext type as well)
interface FormWithId {
  id?: string;
  title: string;
  description: string;
  private: boolean;
  maxResponses: number;
  allowedEmails: string[];
  sections: any[];
  questions: any[];
}

export default function Forms() {
  const { newForm, setNewForm } = useNewForm();
  const [emailInput, setEmailInput] = React.useState("");
  const router = useRouter();

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

    // Generate form ID if not already set and add timestamps
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) {
      const now = Date.now();
      setNewForm(prev => ({
        ...prev,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      }));
    }

    // Use Next.js router for better performance
    router.push("/v1/forms/new/questions");
  }

  const handleAddEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      setNewForm({
        ...newForm,
        allowedEmails: [...(newForm.allowedEmails || []), emailInput.trim()]
      });
      setEmailInput('');
      setErrors((prev) => ({ ...prev, private: '' }));
    }
  };

  const handleRemoveEmail = (index: number) => {
    setNewForm({
      ...newForm,
      allowedEmails: newForm.allowedEmails?.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleBackToDashboard = () => {
    router.push("/v1/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header Section */}
          <Button 
            className="w-fit h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200"
            onClick={handleBackToDashboard}
          >
            <ArrowBigLeft className="w-4 h-4 text-blue-600" />
            <p className="text-blue-600">Voltar</p>
          </Button>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Criar Formulário
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Configure as informações básicas do seu novo formulário
              </p>
            </div>
          </div>

          {/* Form Configuration */}
          <div className="space-y-6">

            {/* Basic Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Informações Básicas
                </h2>
              </div>

              <div className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Nome do formulário *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Pesquisa de Satisfação 2024"
                    className={`h-12 text-base transition-colors ${errors.title
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    value={newForm?.title || ""}
                    onChange={(e) => {
                      setNewForm({ ...newForm, title: e.target.value })
                      setErrors((prev) => ({ ...prev, title: '' }))
                    }}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Descrição (opcional)
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Adicione uma breve descrição sobre o propósito do formulário"
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={newForm?.description || ""}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Esta descrição será exibida no topo do formulário para os respondentes
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Configurações
                </h2>
              </div>

              <div className="space-y-6">
                {/* Máximo de respostas */}
                <div className="space-y-2">
                  <Label htmlFor="maxResponses" className="text-sm font-medium text-gray-700">
                    Limite máximo de respostas (opcional)
                  </Label>
                  <Input
                    id="maxResponses"
                    name="maxResponses"
                    type="number"
                    min="1"
                    placeholder="Ex: 100"
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={newForm?.maxResponses !== undefined ? newForm.maxResponses : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewForm({
                        ...newForm,
                        maxResponses: value === "" ? 0 : parseInt(value, 10)
                      });
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Deixe vazio para permitir respostas ilimitadas
                  </p>
                </div>

                {/* Visibilidade */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Visibilidade do formulário *
                  </Label>
                  <RadioGroup
                    value={newForm?.private ? "private" : "public"}
                    onValueChange={(value) => {
                      if (value === "private") {
                        setNewForm({ ...newForm, private: true, allowedEmails: [] });
                      } else {
                        setNewForm({ ...newForm, private: false, allowedEmails: [] });
                      }
                      setErrors((prev) => ({ ...prev, private: '' }));
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="public" id="public" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="public" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                          <Globe className="w-4 h-4 text-green-600" />
                          Público
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Qualquer pessoa com o link pode responder ao formulário
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="private" id="private" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="private" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                          <Lock className="w-4 h-4 text-orange-600" />
                          Privado
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Apenas pessoas autorizadas podem responder
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* E-mails autorizados - Aparece apenas quando privado */}
                {newForm?.private && (
                  <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <Label className="text-sm font-medium text-orange-900">
                        E-mails autorizados
                      </Label>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="email"
                          placeholder="exemplo@email.com"
                          className="h-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddEmail}
                        disabled={!emailInput.trim() || !emailInput.includes('@')}
                        className="h-10 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>

                    {newForm?.allowedEmails?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-orange-900">
                          E-mails autorizados ({newForm.allowedEmails.length}):
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {newForm.allowedEmails.map((email, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-md border border-orange-200">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">{email}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEmail(idx)}
                                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.private && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.private}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800">
                        Adicione os e-mails das pessoas que devem ter acesso ao formulário.
                        Elas receberão um link exclusivo para responder.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3 pt-6">
              <Button
                disabled={!isFormValid}
                onClick={handleSubmit}
                className={`flex-1 h-12 text-base font-medium transition-all ${isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isFormValid ? 'Continuar para Perguntas' : 'Complete os campos obrigatórios'}
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Passo 1 de 3 - Informações básicas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}