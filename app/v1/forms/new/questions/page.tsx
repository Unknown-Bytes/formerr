"use client";
import React, { useState } from "react";
import { useNewForm } from "../formcontext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  GripVertical, 
  Type, 
  AlignLeft, 
  CheckCircle, 
  CheckSquare, 
  ChevronDown, 
  Calendar,
  Clock,
  CalendarClock,
  Star,
  FileText,
  Settings
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Enhanced QuestionView component with Notion-style design
const QuestionView = ({ question }: { question: Question }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 leading-relaxed">
            {question.title}
            {question.required && (
              <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                Obrigatória
              </span>
            )}
          </h3>
          {question.description && (
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{question.description}</p>
          )}
        </div>
      </div>
      
      {/* Enhanced options display */}
      {(question.type === 'multiple-choice-single' || 
        question.type === 'multiple-choice-multiple' || 
        question.type === 'dropdown' ||
        question.type === 'rating') && question.options && question.options.length > 0 && (
        <div className="mt-3 space-y-2">
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 py-1">
              {question.type === 'multiple-choice-single' && (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              {question.type === 'multiple-choice-multiple' && (
                <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0" />
              )}
              {question.type === 'dropdown' && (
                <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center">
                  <ChevronDown className="w-2 h-2 text-gray-400" />
                </div>
              )}
              {question.type === 'rating' && (
                <Star className="w-4 h-4 text-gray-300" fill="currentColor" />
              )}
              <span className="text-sm text-gray-700">{option.label}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Enhanced input placeholders */}
      {question.type === 'short-text' && (
        <div className="border-b border-gray-200 py-2 text-gray-400 text-sm">
          Resposta curta
        </div>
      )}
      {question.type === 'paragraph' && (
        <div className="border border-gray-200 rounded-md p-3 bg-gray-50/50 text-gray-400 text-sm min-h-[80px] flex items-start">
          Resposta longa...
        </div>
      )}
      {question.type === 'date' && (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-500 text-sm rounded-md border border-gray-200">
          <Calendar className="w-4 h-4" />
          dd/mm/aaaa
        </div>
      )}
      {question.type === 'time' && (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-500 text-sm rounded-md border border-gray-200">
          <Clock className="w-4 h-4" />
          --:--
        </div>
      )}
      {question.type === 'datetime' && (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-500 text-sm rounded-md border border-gray-200">
          <CalendarClock className="w-4 h-4" />
          dd/mm/aaaa --:--
        </div>
      )}
    </div>
  );
};

// Enhanced Sortable Question Item with Notion-style interactions
const SortableQuestionItem = ({ 
  question, 
  index, 
  onEdit, 
  onDelete 
}: { 
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (index: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${
        isDragging ? 'shadow-lg border-blue-300 z-10 rotate-1' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Enhanced drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={`flex-shrink-0 mt-1 p-1 rounded cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } hover:bg-gray-100`}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Question content */}
        <div className="flex-1 min-w-0">
          <QuestionView question={question} />
          
          {/* Question metadata */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full">
              {getQuestionTypeIcon(question.type)}
              <span className="capitalize font-medium">
                {getQuestionTypeLabel(question.type)}
              </span>
            </span>
            <span className="text-gray-400">•</span>
            <span>Pergunta {index + 1}</span>
          </div>
        </div>
        
        {/* Enhanced action buttons */}
        <div className={`flex-shrink-0 flex items-center gap-1 transition-all duration-200 ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => onEdit(question)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for question type icons and labels
const getQuestionTypeIcon = (type: Question['type']) => {
  const iconMap = {
    'short-text': <Type className="w-3 h-3" />,
    'paragraph': <AlignLeft className="w-3 h-3" />,
    'multiple-choice-single': <CheckCircle className="w-3 h-3" />,
    'multiple-choice-multiple': <CheckSquare className="w-3 h-3" />,
    'dropdown': <ChevronDown className="w-3 h-3" />,
    'date': <Calendar className="w-3 h-3" />,
    'time': <Clock className="w-3 h-3" />,
    'datetime': <CalendarClock className="w-3 h-3" />,
    'rating': <Star className="w-3 h-3" />,
  };
  return iconMap[type];
};

const getQuestionTypeLabel = (type: Question['type']) => {
  const labelMap = {
    'short-text': 'Texto curto',
    'paragraph': 'Parágrafo',
    'multiple-choice-single': 'Escolha única',
    'multiple-choice-multiple': 'Múltipla escolha',
    'dropdown': 'Dropdown',
    'date': 'Data',
    'time': 'Hora',
    'datetime': 'Data e hora',
    'rating': 'Avaliação',
  };
  return labelMap[type];
};

// Enhanced Question Types with better icons and descriptions
const QUESTION_TYPES = [
  { 
    id: 'short-text', 
    label: 'Texto Curto', 
    description: 'Respostas breves em uma linha',
    icon: Type,
    color: 'blue',
    preview: {
      title: 'Qual é o seu nome?',
      type: 'short-text',
      required: true
    }
  },
  { 
    id: 'paragraph', 
    label: 'Parágrafo', 
    description: 'Respostas longas e detalhadas',
    icon: AlignLeft,
    color: 'green',
    preview: {
      title: 'Conte-nos sobre você',
      type: 'paragraph',
      description: 'Fale sobre suas experiências e interesses',
      required: false
    }
  },
  { 
    id: 'multiple-choice-single', 
    label: 'Escolha Única', 
    description: 'Uma opção entre várias',
    icon: CheckCircle,
    color: 'purple',
    preview: {
      title: 'Qual é a sua cor favorita?',
      type: 'multiple-choice-single',
      options: [
        { id: '1', label: 'Vermelho' },
        { id: '2', label: 'Azul' },
        { id: '3', label: 'Verde' }
      ],
      required: true
    }
  },
  { 
    id: 'multiple-choice-multiple', 
    label: 'Múltipla Escolha', 
    description: 'Várias opções podem ser selecionadas',
    icon: CheckSquare,
    color: 'indigo',
    preview: {
      title: 'Quais idiomas você fala?',
      type: 'multiple-choice-multiple',
      options: [
        { id: '1', label: 'Português' },
        { id: '2', label: 'Inglês' },
        { id: '3', label: 'Espanhol' },
        { id: '4', label: 'Outro' }
      ],
      required: false
    }
  },
  { 
    id: 'dropdown', 
    label: 'Menu Suspenso', 
    description: 'Lista suspensa de opções',
    icon: ChevronDown,
    color: 'orange',
    preview: {
      title: 'Selecione seu país',
      type: 'dropdown',
      options: [
        { id: '1', label: 'Brasil' },
        { id: '2', label: 'Portugal' },
        { id: '3', label: 'Outro' }
      ],
      required: true
    }
  },
  { 
    id: 'date', 
    label: 'Data', 
    description: 'Seletor de data',
    icon: Calendar,
    color: 'red',
    preview: {
      title: 'Data de nascimento',
      type: 'date',
      required: true
    }
  },
  { 
    id: 'time', 
    label: 'Hora', 
    description: 'Seletor de horário',
    icon: Clock,
    color: 'yellow',
    preview: {
      title: 'Horário preferido para contato',
      type: 'time',
      required: false
    }
  },
  { 
    id: 'datetime', 
    label: 'Data e Hora', 
    description: 'Seletor de data e horário',
    icon: CalendarClock,
    color: 'pink',
    preview: {
      title: 'Data e hora do evento',
      type: 'datetime',
      required: true
    }
  },
  { 
    id: 'rating', 
    label: 'Avaliação', 
    description: 'Escala de classificação',
    icon: Star,
    color: 'amber',
    preview: {
      title: 'Avalie nossa plataforma',
      type: 'rating',
      options: [
        { id: '1', label: '1' },
        { id: '2', label: '2' },
        { id: '3', label: '3' },
        { id: '4', label: '4' },
        { id: '5', label: '5' }
      ],
      required: true
    }
  },
];

type Section = {
	id: string;
	title: string;
	description: string;
	order: number;
	questions?: Question[];
	formId?: string;
	createdAt?: number;
	updatedAt?: number;
};

type Question = {
	id: string;
	title: string;
	description: string;
	type:
		| "short-text"
		| "paragraph"
		| "multiple-choice-single"
		| "multiple-choice-multiple"
		| "dropdown"
		| "date"
		| "time"
		| "datetime"
		| "rating";
	required: boolean;
	order: number;
	options?: { id: string; label: string }[];
};

const defaultSection: Section = {
	id: "",
	title: "",
	description: "",
	order: 0,
	questions: [],
	formId: "",
	createdAt: Date.now(),
	updatedAt: Date.now()
};

const createNewQuestion = (type: Question['type'] = 'short-text', order: number = 0): Question => ({
  id: uuidv4(),
  title: `Nova pergunta`,
  description: "",
  type,
  required: false,
  order,
  options: type === 'multiple-choice-single' || type === 'multiple-choice-multiple' || type === 'dropdown' || type === 'rating'
    ? [{ id: uuidv4(), label: 'Opção 1' }]
    : undefined
});

export default function Questions() {
  const { newForm, setNewForm } = useNewForm();
  const [newSection, setNewSection] = useState<Section>({ ...defaultSection });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        return newItems.map((item, index) => ({
          ...item,
          order: index
        }));
      });
    }
  };

  const handleAddQuestion = (type: Question['type']) => {
    const newQuestion = createNewQuestion(type, questions.length);
    setQuestions([...questions, newQuestion]);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const reorderedQuestions = updatedQuestions.map((question, i) => ({
      ...question,
      order: i
    }));
    setQuestions(reorderedQuestions);
  };

	return (
		<div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8 max-w-4xl">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Criar Seção
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Configure uma nova seção com perguntas personalizadas
                </p>
              </div>

              {/* Section Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informações da Seção
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nome da seção *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: Informações pessoais"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={newSection?.title || ""}
                      onChange={(e) => {
                        setNewSection({ ...newSection, title: e.target.value });
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                      Descrição (opcional)
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Adicione uma descrição para orientar os respondentes"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={newSection?.description || ""}
                      onChange={(e) => {
                        setNewSection({ ...newSection, description: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Perguntas da Seção
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {questions.length} pergunta{questions.length !== 1 ? 's' : ''} adicionada{questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma pergunta adicionada
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comece selecionando um tipo de pergunta no painel lateral
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
                      <span>Escolha um tipo de pergunta</span>
                      <span>→</span>
                    </div>
                  </div>
                ) : (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={questions.map(q => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {questions.map((question, index) => (
                          <SortableQuestionItem
                            key={question.id}
                            question={question}
                            index={index}
                            onEdit={handleEditQuestion}
                            onDelete={handleDeleteQuestion}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                className="flex-1 h-12 text-base font-medium"
                variant="outline"
                onClick={() => {
                  // Lógica para adicionar a seção
                }}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 h-12 text-base font-medium bg-yellow-500 hover:bg-yellow-600"
                onClick={() => {
                  // Lógica para publicar
                }}
              >
                Proxíma Seção
              </Button>
            </div>
            <Button
                className="flex-1 h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // Lógica para publicar
                }}
              >
                Publicar Formulário
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Question Editor Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6 border-b border-gray-200">
              <DialogTitle className="text-xl font-semibold">
                {editingQuestion ? 'Editar pergunta' : 'Nova pergunta'}
              </DialogTitle>
            </DialogHeader>
            {editingQuestion && (
              <div className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="question-title" className="text-sm font-medium text-gray-700">
                    Pergunta
                  </Label>
                  <Input
                    id="question-title"
                    value={editingQuestion.title}
                    onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})}
                    placeholder="Digite sua pergunta"
                    className="h-12 text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-description" className="text-sm font-medium text-gray-700">
                    Descrição (opcional)
                  </Label>
                  <Input
                    id="question-description"
                    value={editingQuestion.description || ''}
                    onChange={(e) => setEditingQuestion({...editingQuestion, description: e.target.value})}
                    placeholder="Adicione uma descrição para esclarecer a pergunta"
                    className="h-12 text-base"
                  />
                </div>

                {(editingQuestion.type === 'multiple-choice-single' || 
                  editingQuestion.type === 'multiple-choice-multiple' || 
                  editingQuestion.type === 'dropdown' ||
                  editingQuestion.type === 'rating') && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Opções de resposta
                    </Label>
                    <div className="space-y-3">
                      {editingQuestion.options?.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...editingQuestion.options!];
                                newOptions[index] = { ...option, label: e.target.value };
                                setEditingQuestion({...editingQuestion, options: newOptions});
                              }}
                              placeholder={`Opção ${index + 1}`}
                              className="h-10"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              const newOptions = editingQuestion.options?.filter((_, i) => i !== index);
                              setEditingQuestion({...editingQuestion, options: newOptions || []});
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-10 mt-3 border-dashed"
                        onClick={() => {
                          const newOption = { id: uuidv4(), label: `Opção ${(editingQuestion.options?.length || 0) + 1}` };
                          setEditingQuestion({
                            ...editingQuestion,
                            options: [...(editingQuestion.options || []), newOption]
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar opção
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`required-${editingQuestion.id}`}
                      checked={editingQuestion.required}
                      onChange={(e) => setEditingQuestion({...editingQuestion, required: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`required-${editingQuestion.id}`} className="text-sm font-medium text-gray-700">
                      Tornar esta pergunta obrigatória
                    </Label>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="h-10">
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        if (editingQuestion) {
                          const updatedQuestions = questions.map(q => 
                            q.id === editingQuestion.id ? editingQuestion : q
                          );
                          setQuestions(updatedQuestions);
                          setIsEditing(false);
                        }
                      }}
                      className="h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      Salvar pergunta
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto sticky top-0">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Tipos de Pergunta
              </h2>
              <p className="text-sm text-gray-600">
                Escolha o tipo mais adequado para sua pergunta
              </p>
            </div>
            
            <div className="space-y-3">
              {QUESTION_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div 
                    key={type.id}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    onClick={() => handleAddQuestion(type.id as Question['type'])}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${type.color}-100 group-hover:bg-${type.color}-200 transition-colors`}>
                        <IconComponent className={`w-5 h-5 text-${type.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                          {type.description}
                        </p>
                        
                        {/* Preview */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                          <div className="text-xs font-medium text-gray-700 mb-2">
                            {type.preview.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type.preview.type === 'short-text' && (
                              <div className="border-b border-gray-300 py-1">Resposta curta</div>
                            )}
                            {type.preview.type === 'paragraph' && (
                              <div className="border-b border-gray-300 py-1">Resposta longa</div>
                            )}
                            {(type.preview.type === 'multiple-choice-single' || 
                              type.preview.type === 'multiple-choice-multiple' || 
                              type.preview.type === 'dropdown') && (
                              <div className="space-y-1">
                                {type.preview.options?.slice(0, 2).map((option, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 border border-gray-400 ${
                                      type.preview.type === 'multiple-choice-single' ? 'rounded-full' : 'rounded'
                                    }`} />
                                    <span>{option.label}</span>
                                  </div>
                                ))}
                                {type.preview.options && type.preview.options.length > 2 && (
                                  <div className="text-gray-400">...</div>
                                )}
                              </div>
                            )}
                            {type.preview.type === 'rating' && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                                ))}
                              </div>
                            )}
                            {(type.preview.type === 'date' || 
                              type.preview.type === 'time' || 
                              type.preview.type === 'datetime') && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                {type.icon && <type.icon className="w-3 h-3" />}
                                {type.preview.type === 'date' && 'dd/mm/aaaa'}
                                {type.preview.type === 'time' && '--:--'}
                                {type.preview.type === 'datetime' && 'dd/mm/aaaa --:--'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
	);
}