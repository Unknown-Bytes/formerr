"use client";
import React, { useState, useEffect } from "react";
import { useNewForm } from "../app/v1/forms/new/formcontext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Code, 
  Eye, 
  Users, 
  Clock, 
  BarChart3,
  Settings,
  Edit,
  Plus,
  ExternalLink,
  Download,
  Mail,
  Globe,
  Lock,
  Calendar,
  Smartphone,
  Monitor,
  Play,
  Pause,
  Archive,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  GripVertical,
  ArrowBigLeft,
  Webhook,
  Bell,
  Link as LinkIcon,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner"; 
import { 
  publishForm, 
  updateFormStatus, 
  updateForm,
  getFormStats 
} from '@/lib/actions/form-actions';
import type { FormStats } from '@/lib/types/form-types';

// Form Status Types
type FormStatus = 'draft' | 'active' | 'paused' | 'archived';

interface PublishProps {
  userId: string;
}

export default function Publish({ userId }: PublishProps) {
  const { 
    newForm, 
    setNewForm, 
    saveForm, 
    publishFormAction, 
    isLoading: contextLoading 
  } = useNewForm();
  const router = useRouter();

  useEffect(() => {
    // Se temos um ID mas não temos seções, recarregar
    if (newForm.id && newForm.sections.length === 0) {
      refreshForm();
    }
  }, [newForm.id]);
  
  // Loading states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Form status and settings
  const [formStatus, setFormStatus] = useState<FormStatus>('draft');
  const [formUrl, setFormUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [stats, setStats] = useState<FormStats>({
    views: 0,
    responses: 0,
    conversionRate: 0,
    avgCompletionTime: '0m 0s',
    dailyResponses: []
  });
  
  // Settings
  const [thankYouMessage, setThankYouMessage] = useState('Obrigado por responder nosso formulário!');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [formPassword, setFormPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // Preview mode
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  
  // Dialogs
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);

  // Initialize form data and status
  useEffect(() => {
    if (newForm && (newForm as any).id) {
      const formId = (newForm as any).id;
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://forms.brunovallim.com' 
        : 'http://localhost:3000';
      const url = `${baseUrl}/form/${formId}`;
      
      setFormUrl(url);
      setEmbedCode(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`);
      
      // Set initial status from form data
      const status = (newForm as any).status || 'draft';
      setFormStatus(status);
      setIsPublished(status === 'active' || status === 'paused');
      
      // Load stats if published
      if (status === 'active' || status === 'paused') {
        loadFormStats(formId);
      }
      
      // Initialize settings
      setThankYouMessage((newForm as any).thankYouMessage || 'Obrigado por responder nosso formulário!');
      setEmailNotifications((newForm as any).emailNotifications ?? true);
      setPasswordProtected((newForm as any).passwordProtected ?? false);
      setRedirectUrl((newForm as any).redirectUrl || '');
      setWebhookUrl((newForm as any).webhookUrl || '');
    }
  }, [newForm]);

  const loadFormStats = async (formId: string) => {
    if (!formId) return;
    
    setIsLoadingStats(true);
    try {
      const formStats = await getFormStats(formId);
      setStats(formStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handlePublishForm = async () => {
    if (!newForm.title || newForm.sections.length === 0) {
      toast.error('Formulário deve ter título e pelo menos uma seção');
      return;
    }

    setIsPublishing(true);
    try {
      // First save the form if not already saved
      let formId = (newForm as any).id;
      if (!formId) {
        const saveResult = await saveForm();
        if (!saveResult.success) {
          toast.error('Erro ao salvar formulário');
          return;
        }
        formId = saveResult.formId;
      }

      // Then publish it
      const result = await publishForm(formId);
      if (result.success) {
        setIsPublished(true);
        setFormStatus('active');
        toast.success('Formulário publicado com sucesso!');
        
        // Load initial stats
        loadFormStats(formId);
      } else {
        toast.error(result.error || 'Erro ao publicar formulário');
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Erro ao publicar formulário');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublishForm = async () => {
    const formId = (newForm as any).id;
    if (!formId) return;

    setIsUpdatingStatus(true);
    try {
      const result = await updateFormStatus(formId, 'draft');
      if (result.success) {
        setIsPublished(false);
        setFormStatus('draft');
        toast.success('Formulário despublicado');
      } else {
        toast.error(result.error || 'Erro ao despublicar formulário');
      }
    } catch (error) {
      console.error('Error unpublishing form:', error);
      toast.error('Erro ao despublicar formulário');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStatusChange = async () => {
    const formId = (newForm as any).id;
    if (!formId) return;

    const newStatus = formStatus === 'active' ? 'paused' : 'active';
    setIsUpdatingStatus(true);
    
    try {
      const result = await updateFormStatus(formId, newStatus);
      if (result.success) {
        setFormStatus(newStatus);
        toast.success(`Formulário ${newStatus === 'active' ? 'ativado' : 'pausado'}`);
      } else {
        toast.error(result.error || 'Erro ao alterar status');
      }
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Erro ao alterar status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveAdvancedSettings = async () => {
    const formId = (newForm as any).id;
    if (!formId) return;

    setIsSavingSettings(true);
    try {
      const result = await updateForm(formId, {
        thankYouMessage,
        redirectUrl,
        emailNotifications,
        passwordProtected,
        formPassword: passwordProtected ? formPassword : undefined,
        webhookUrl,
        ownerId: userId // Required field
      });

      if (result.success) {
        toast.success('Configurações salvas com sucesso!');
        setShowSettingsDialog(false);
      } else {
        toast.error(result.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado para a área de transferência!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Erro ao copiar');
    }
  };

  const getStatusColor = (status: FormStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status: FormStatus) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'archived': return 'Arquivado';
      default: return 'Rascunho';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <Button 
              className="w-fit h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200"
              onClick={() => router.push("/v1/forms/new/questions")}
            >
              <ArrowBigLeft className="w-4 h-4 text-blue-600" />
              <p className="text-blue-600">Voltar às Perguntas</p>
            </Button>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {newForm.title || 'Formulário sem título'}
                  </h1>
                  <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(formStatus)}`}>
                    {getStatusLabel(formStatus)}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600">
                  {newForm.description || 'Configure e publique seu formulário'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!isPublished ? (
                  <Button
                    onClick={handlePublishForm}
                    className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-medium"
                    disabled={!newForm.title || newForm.sections.length === 0 || isPublishing || contextLoading}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Publicar Formulário
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleStatusChange}
                      variant="outline"
                      className="h-12 px-4"
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : formStatus === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleUnpublishForm}
                      variant="outline"
                      className="h-12 px-4"
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <>
                          <Archive className="w-4 h-4 mr-2" />
                          Despublicar
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                <Button
                  onClick={() => setShowShareDialog(true)}
                  variant="outline"
                  className="h-12 px-4"
                  disabled={!isPublished}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              {isPublished && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          {isLoadingStats ? (
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Visualizações</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          {isLoadingStats ? (
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-900">{stats.responses}</p>
                              <p className="text-sm text-gray-600">Respostas</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          {isLoadingStats ? (
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-200 rounded w-14 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                              <p className="text-sm text-gray-600">Conversão</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          {isLoadingStats ? (
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionTime}</p>
                              <p className="text-sm text-gray-600">Tempo médio</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Form Structure Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Estrutura do Formulário
                      </CardTitle>
                      <CardDescription>
                        {newForm.sections.length} seção{newForm.sections.length !== 1 ? 'ões' : ''} • {newForm.questions.length} pergunta{newForm.questions.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/v1/forms/new/questions")}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(true)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {newForm.sections.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="mb-4">Nenhuma seção criada ainda</p>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/v1/forms/new/questions")}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Primeira Seção
                        </Button>
                      </div>
                    ) : (
                      newForm.sections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => {
                          const sectionQuestions = newForm.questions.filter(q => q.sectionId === section.id);
                          return (
                            <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                    <h4 className="font-medium text-gray-900">
                                      {section.title || `Seção ${index + 1}`}
                                    </h4>
                                    <Badge variant="outline" className="text-xs">
                                      {sectionQuestions.length} pergunta{sectionQuestions.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                  {section.description && (
                                    <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                                  )}
                                  <div className="space-y-1">
                                    {sectionQuestions
                                      .sort((a, b) => a.order - b.order)
                                      .slice(0, 3)
                                      .map((question) => (
                                        <div key={question.id} className="text-sm text-gray-500">
                                          • {question.title}
                                        </div>
                                      ))
                                    }
                                    {sectionQuestions.length > 3 && (
                                      <div className="text-sm text-gray-400">
                                        ... e mais {sectionQuestions.length - 3} pergunta{sectionQuestions.length - 3 !== 1 ? 's' : ''}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => router.push("/v1/forms/new/questions")}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Access Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {newForm.private ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                    Configurações de Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Visibilidade</p>
                      <p className="text-sm text-gray-600">
                        {newForm.private ? 'Apenas pessoas autorizadas' : 'Qualquer pessoa com o link'}
                      </p>
                    </div>
                    <Badge variant={newForm.private ? 'secondary' : 'default'}>
                      {newForm.private ? 'Privado' : 'Público'}
                    </Badge>
                  </div>

                  {newForm.private && newForm.allowedEmails.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">E-mails Autorizados ({newForm.allowedEmails.length})</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {newForm.allowedEmails.slice(0, 5).map((email, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                            {email}
                          </div>
                        ))}
                        {newForm.allowedEmails.length > 5 && (
                          <div className="text-sm text-gray-400">
                            ... e mais {newForm.allowedEmails.length - 5} email{newForm.allowedEmails.length - 5 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Limite de Respostas</p>
                      <p className="text-sm text-gray-600">
                        {newForm.maxResponses > 0 ? `Máximo ${newForm.maxResponses} respostas` : 'Ilimitado'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/v1/forms/new")}
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Actions and Settings */}
            <div className="space-y-6">
              {/* Quick Share */}
              {isPublished && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Compartilhamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Link do Formulário</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={formUrl}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(formUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmbedDialog(true)}
                        className="flex-1"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        Incorporar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => toast.info('QR Code em desenvolvimento')}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Advanced Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurações Avançadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-gray-600">Receber novas respostas</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Proteção por Senha</p>
                      <p className="text-sm text-gray-600">Exigir senha para acessar</p>
                    </div>
                    <Switch
                      checked={passwordProtected}
                      onCheckedChange={setPasswordProtected}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowSettingsDialog(true)}
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mais Configurações
                  </Button>
                </CardContent>
              </Card>

              {/* Export Data */}
              {isPublished && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Exportar Dados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Exportação CSV em desenvolvimento')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Exportação JSON em desenvolvimento')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Relatórios em desenvolvimento')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver Relatório
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Passo 3 de 3 - Publicação e configurações
          </p>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compartilhar Formulário</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="embed">Incorporar</TabsTrigger>
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <div>
                <Label>URL do Formulário</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={formUrl} readOnly />
                  <Button onClick={() => copyToClipboard(formUrl)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => toast.info('QR Code em desenvolvimento')}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar QR Code
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir em Nova Aba
                  </a>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4">
              <div>
                <Label>Código de Incorporação</Label>
                <Textarea
                  value={embedCode}
                  readOnly
                  rows={4}
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <Button onClick={() => copyToClipboard(embedCode)} className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </Button>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const text = `Confira este formulário: ${newForm.title}`;
                    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + formUrl)}`;
                    window.open(url, '_blank');
                  }}
                >
                  WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Compartilhamento em redes sociais em desenvolvimento')}
                >
                  Facebook
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Compartilhamento em redes sociais em desenvolvimento')}
                >
                  Twitter
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Compartilhamento em redes sociais em desenvolvimento')}
                >
                  LinkedIn
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Advanced Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações Avançadas</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Mensagem de Agradecimento</Label>
              <Textarea
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                placeholder="Mensagem exibida após o envio do formulário"
                className="mt-1"
              />
            </div>

            <div>
              <Label>URL de Redirecionamento (opcional)</Label>
              <Input
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://exemplo.com/obrigado"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Data de Expiração (opcional)</Label>
              <Input
                type="datetime-local"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="mt-1"
              />
            </div>

            {passwordProtected && (
              <div>
                <Label>Senha do Formulário</Label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Digite uma senha"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>Webhook URL (opcional)</Label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.exemplo.com/webhook"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Receba notificações em tempo real das respostas
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowSettingsDialog(false)} 
                className="flex-1"
                disabled={isSavingSettings}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveAdvancedSettings} 
                className="flex-1"
                disabled={isSavingSettings}
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Preview do Formulário</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className={previewMode === 'desktop' ? 'bg-blue-50' : ''}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className={previewMode === 'mobile' ? 'bg-blue-50' : ''}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className={`bg-gray-100 p-4 rounded-lg ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div className="text-center border-b pb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{newForm.title}</h1>
                  {newForm.description && (
                    <p className="text-gray-600 mt-2">{newForm.description}</p>
                  )}
                </div>
                
                {newForm.sections.map((section, sectionIndex) => {
                  const sectionQuestions = newForm.questions.filter(q => q.sectionId === section.id);
                  return (
                    <div key={section.id} className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                        {section.description && (
                          <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                        )}
                      </div>
                      
                      {sectionQuestions.map((question, questionIndex) => (
                        <div key={question.id} className="space-y-2">
                          <Label className="text-base font-medium">
                            {question.title}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {question.description && (
                            <p className="text-sm text-gray-600">{question.description}</p>
                          )}
                          
                          {/* Question preview based on type */}
                          {question.type === 'short-text' && (
                            <Input placeholder="Resposta curta" disabled />
                          )}
                          {question.type === 'paragraph' && (
                            <Textarea placeholder="Resposta longa..." rows={3} disabled />
                          )}
                          {/* Add more question type previews as needed */}
                        </div>
                      ))}
                    </div>
                  );
                })}
                
                <div className="pt-6 border-t">
                  <Button className="w-full" disabled>
                    Enviar Respostas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}