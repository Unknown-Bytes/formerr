"use client";
import React, { useState, useEffect } from "react";
import { useNewForm } from "../formcontext";
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
  Link as LinkIcon
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

// Form Status Types
type FormStatus = 'draft' | 'active' | 'paused' | 'archived';

// Mock data for demonstration
// TODO: Substituir por dados reais do banco de dados via API
const mockStats = {
  views: 1247,
  responses: 89,
  conversionRate: 7.1,
  avgCompletionTime: "3m 42s",
  dailyResponses: [
    { date: "2025-06-10", responses: 12 },
    { date: "2025-06-11", responses: 18 },
    { date: "2025-06-12", responses: 15 },
    { date: "2025-06-13", responses: 22 },
    { date: "2025-06-14", responses: 8 },
    { date: "2025-06-15", responses: 14 },
    { date: "2025-06-16", responses: 0 },
  ]
};

export default function Publish() {
  // Extend the newForm type to include an optional id
  type FormWithId = typeof newForm & { id?: string };
  const { newForm, setNewForm } = useNewForm();
  const router = useRouter();
  
  // Form status and settings
  const [formStatus, setFormStatus] = useState<FormStatus>('draft');
  const [formUrl, setFormUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
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

  // Generate form URL and embed code
  useEffect(() => {
    if (newForm && (newForm as any).id) {
      const baseUrl = 'https://forms.brunovallim.com';
      const formId = (newForm as any).id;
      const url = `${baseUrl}/form/${formId}`;
      setFormUrl(url);
      setEmbedCode(`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`);
    }
  }, [newForm]);

  const handlePublishForm = async () => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newForm,
          status: 'active',
          publishedAt: new Date().toISOString(),
          settings: {
            thankYouMessage,
            redirectUrl,
            passwordProtected,
            formPassword: passwordProtected ? formPassword : undefined,
            emailNotifications,
            webhookUrl,
            expirationDate
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish form');
      }

      const result = await response.json();
      setIsPublished(true);
      setFormStatus('active');
      
      // Update the form ID in context if this is a new form
      if (result.data?.id) {
        const updatedForm = { ...newForm, id: result.data.id } as FormWithId;
      setNewForm(updatedForm);
      }
      
      // Show success message
      // Using toast from sonner or your preferred toast library
      const { toast } = await import('sonner');
      toast.success('Formulário publicado com sucesso!');
      
      // Update the URL with the new form ID if needed
      if (result.data?.id && !window.location.href.includes(result.data.id)) {
        window.history.pushState({}, '', `/v1/forms/${result.data.id}/publish`);
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao publicar o formulário. Tente novamente.');
    }
  };

  const handleUnpublishForm = async () => {
    // Type assertion to include the id property
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    try {
      const response = await fetch(`/api/forms/${formWithId.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'draft' }),
      });

      if (!response.ok) {
        throw new Error('Failed to unpublish form');
      }

      setIsPublished(false);
      setFormStatus('draft');
      
      const { toast } = await import('sonner');
      toast.success('Formulário despublicado com sucesso');
    } catch (error) {
      console.error('Error unpublishing form:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao despublicar o formulário. Tente novamente.');
    }
  };

  const handleStatusChange = async () => {
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    try {
      const newStatus = formStatus === 'active' ? 'paused' : 'active';
      
      const response = await fetch(`/api/forms/${formWithId.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }

      setFormStatus(newStatus);
      const { toast } = await import('sonner');
      toast.success(`Formulário ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso`);
    } catch (error) {
      console.error('Error changing status:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao alterar o status do formulário. Tente novamente.');
    }
  };

  const handleSaveAdvancedSettings = async () => {
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    try {
      const settings = {
        thankYouMessage,
        redirectUrl: redirectUrl || null,
        passwordProtected,
        formPassword: passwordProtected ? formPassword : null,
        emailNotifications,
        webhookUrl: webhookUrl || null,
        expirationDate: expirationDate || null
      };
      
      const response = await fetch(`/api/forms/${formWithId.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      const { toast } = await import('sonner');
      toast.success('Configurações salvas com sucesso!');
      setShowSettingsDialog(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao salvar as configurações. Tente novamente.');
    }
  };

  const loadFormStats = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to load form statistics');
      }
      
      const stats = await response.json();
      
      // Update the mockStats with real data
      // This assumes the API returns data in a compatible format
      if (stats) {
        // Update any UI elements that depend on stats
        console.log('Loaded form stats:', stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao carregar estatísticas do formulário');
    }
  };

  const handleGenerateQRCode = () => {
    try {
      // Using an external QR code generation service
      // In a real app, you might want to use a client-side library like 'qrcode' instead
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formUrl)}`;
      
      // Open the QR code in a new tab
      window.open(qrCodeUrl, '_blank');
      
      // Show success message
      const toast = require('sonner').toast;
      toast.success('QR Code gerado com sucesso!');
    } catch (error) {
      console.error('Error generating QR Code:', error);
      const toast = require('sonner').toast;
      toast.error('Erro ao gerar QR Code. Tente novamente.');
    }
  };

  // Helper function to trigger file download
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    try {
      const response = await fetch(`/api/forms/${formWithId.id}/export?format=csv`);
      
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }
      
      const csvData = await response.text();
      const fileName = `${newForm.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-respostas.csv`;
      downloadFile(csvData, fileName, 'text/csv;charset=utf-8;');
      
      const { toast } = await import('sonner');
      toast.success('Exportação em CSV concluída com sucesso!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao exportar dados em CSV. Tente novamente.');
    }
  };

  const handleExportJSON = async () => {
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    try {
      const response = await fetch(`/api/forms/${formWithId.id}/export?format=json`);
      
      if (!response.ok) {
        throw new Error('Failed to export JSON');
      }
      
      const jsonData = await response.text();
      const fileName = `${newForm.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-respostas.json`;
      downloadFile(JSON.stringify(JSON.parse(jsonData), null, 2), fileName, 'application/json');
      
      const { toast } = await import('sonner');
      toast.success('Exportação em JSON concluída com sucesso!');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      const { toast } = await import('sonner');
      toast.error('Erro ao exportar dados em JSON. Tente novamente.');
    }
  };

  const handleViewReports = () => {
    const formWithId = newForm as FormWithId;
    if (!formWithId.id) return;
    
    router.push(`/v1/forms/${formWithId.id}/reports`);
  };

  const handleSocialShare = (platform: string) => {
    const text = `Confira este formulário: ${newForm.title}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(formUrl);
    
    try {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
          break;
          
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
            'facebook-share-dialog',
            'width=626,height=436'
          );
          break;
          
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            'twitter-share-dialog',
            'width=550,height=420'
          );
          break;
          
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            'linkedin-share-dialog',
            'width=550,height=420'
          );
          break;
          
        case 'email':
          window.location.href = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`;
          break;
          
        default:
          console.warn('Plataforma de compartilhamento não suportada:', platform);
      }
      
      // Log the share event
      const formWithId = newForm as FormWithId;
      if (formWithId.id) {
        fetch(`/api/forms/${formWithId.id}/analytics/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform })
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Error sharing form:', error);
      const { toast } = require('sonner');
      toast.error(`Erro ao compartilhar no ${platform}. Tente novamente.`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Show success feedback
      const { toast } = await import('sonner');
      toast.success('Copiado para a área de transferência!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        icon: '📋',
      });
      
      return true;
      console.log('Copied to clipboard:', text);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // TODO: Adicionar toast de erro
      // toast.error('Erro ao copiar');
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
                    disabled={!newForm.title || newForm.sections.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Publicar Formulário
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleStatusChange}
                      variant="outline"
                      className="h-12 px-4"
                    >
                      {formStatus === 'active' ? (
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
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Despublicar
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
                          {/* TODO: Carregar dados reais do banco */}
                          <p className="text-2xl font-bold text-gray-900">{mockStats.views.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Visualizações</p>
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
                          {/* TODO: Carregar dados reais do banco */}
                          <p className="text-2xl font-bold text-gray-900">{mockStats.responses}</p>
                          <p className="text-sm text-gray-600">Respostas</p>
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
                          {/* TODO: Calcular taxa de conversão real */}
                          <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
                          <p className="text-sm text-gray-600">Conversão</p>
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
                          {/* TODO: Calcular tempo médio real */}
                          <p className="text-2xl font-bold text-gray-900">{mockStats.avgCompletionTime}</p>
                          <p className="text-sm text-gray-600">Tempo médio</p>
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
                    onClick={() => router.push("/v1/forms/new/title")}
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
                        onClick={handleGenerateQRCode}
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
                      onClick={handleExportCSV}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleExportJSON}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleViewReports}
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
                  onClick={handleGenerateQRCode}
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
                  onClick={() => handleSocialShare('whatsapp')}
                >
                  WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('facebook')}
                >
                  Facebook
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('twitter')}
                >
                  Twitter
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('linkedin')}
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
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveAdvancedSettings} 
                className="flex-1"
              >
                Salvar Configurações
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
                          
                          {/* TODO: Implementar previews para todos os tipos de pergunta */}
                          {question.type === 'short-text' && (
                            <Input placeholder="Resposta curta" disabled />
                          )}
                          {question.type === 'paragraph' && (
                            <Textarea placeholder="Resposta longa..." rows={3} disabled />
                          )}
                          {/* Adicionar mais tipos de pergunta aqui */}
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