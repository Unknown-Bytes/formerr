"use client";
import React, { useState } from "react";
import { useNewForm } from "../formcontext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit, X, GripVertical } from "lucide-react";
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

// Custom QuestionView component to show question details
const QuestionView = ({ question }: { question: Question }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>
      
      {question.description && (
        <p className="text-sm text-gray-500">{question.description}</p>
      )}
      
      {/* Show options for question types that have them */}
      {(question.type === 'multiple-choice-single' || 
        question.type === 'multiple-choice-multiple' || 
        question.type === 'dropdown' ||
        question.type === 'rating') && question.options && question.options.length > 0 && (
        <div className="mt-2 space-y-2">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center gap-2 text-sm">
              {question.type === 'multiple-choice-single' && (
                <div className="w-4 h-4 rounded-full border border-gray-400 flex-shrink-0" />
              )}
              {question.type === 'multiple-choice-multiple' && (
                <div className="w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0" />
              )}
              {question.type === 'dropdown' && (
                <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
                  <span className="text-xs">▼</span>
                </div>
              )}
              {question.type === 'rating' && (
                <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
                  <span className="text-xs">★</span>
                </div>
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Show input placeholders for other question types */}
      {question.type === 'short-text' && (
        <div className="border-b border-gray-300 py-1 text-gray-400">Resposta curta</div>
      )}
      {question.type === 'paragraph' && (
        <div className="border border-gray-300 rounded p-2 h-20 text-gray-400">
          Resposta longa
        </div>
      )}
      {question.type === 'date' && (
        <div className="px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded inline-block">
          dd/mm/aaaa
        </div>
      )}
      {question.type === 'time' && (
        <div className="px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded inline-block">
          --:--
        </div>
      )}
      {question.type === 'datetime' && (
        <div className="px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded inline-block">
          dd/mm/aaaa --:--
        </div>
      )}
    </div>
  );
};

// Sortable Question Item Component
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border rounded-lg p-4 bg-white transition-all ${
        isDragging ? 'shadow-lg z-10' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-1 p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Question content */}
        <div className="flex-1 min-w-0">
          <QuestionView question={question} />
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="capitalize">{question.type.replace(/-/g, ' ')}</span>
            {question.required && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full">
                Obrigatória
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(question)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const QUESTION_TYPES = [
  { 
    id: 'short-text', 
    label: 'Resposta Curta', 
    icon: 'T',
    preview: {
      title: 'Qual é o seu nome?',
      type: 'short-text',
      required: true
    }
  },
  { 
    id: 'paragraph', 
    label: 'Parágrafo', 
    icon: '¶',
    preview: {
      title: 'Conte-nos sobre você',
      type: 'paragraph',
      description: 'Fale sobre suas experiências e interesses',
      required: false
    }
  },
  { 
    id: 'multiple-choice-single', 
    label: 'Múltipla Escolha (Única Resposta)', 
    icon: '☑️',
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
    label: 'Múltipla Escolha (Múltiplas Respostas)', 
    icon: '☑️☑️',
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
    icon: '▼',
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
    icon: '📅',
    preview: {
      title: 'Data de nascimento',
      type: 'date',
      required: true
    }
  },
  { 
    id: 'time', 
    label: 'Hora', 
    icon: '🕒',
    preview: {
      title: 'Horário preferido para contato',
      type: 'time',
      required: false
    }
  },
  { 
    id: 'datetime', 
    label: 'Data e Hora', 
    icon: '📅 🕒',
    preview: {
      title: 'Data e hora do evento',
      type: 'datetime',
      required: true
    }
  },
  { 
    id: 'rating', 
    label: 'Classificação', 
    icon: '⭐',
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
        
        // Use arrayMove to reorder the array
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update the order property for each question
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
    // Re-order remaining questions
    const reorderedQuestions = updatedQuestions.map((question, i) => ({
      ...question,
      order: i
    }));
    setQuestions(reorderedQuestions);
  };

	return (
		<div className="h-full flex flex-row justify-between gap-4">
			<div className="w-7/10 h-full overflow-y-auto p-8">
                <div>
                <h2 className="text-2xl text-black font-bold">Seções</h2>
			<p className="text-sm text-muted-foreground">Adicione perguntas ao seu formulário</p>
			<div className="mt-4">
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="title">
							<p>Qual o nome dessa seção? *</p>
						</Label>
						<Input
							className="p-6"
							id="title"
							name="title"
							placeholder="Informe o nome da seção"
							required
							aria-required
							value={newSection?.title || ""}
							onChange={(e) => {
								setNewSection({ ...newSection, title: e.target.value });
							}}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">
							<p>Descrição da seção (opcional)</p>
						</Label>
						<Input
							className="p-6"
							id="description"
							name="description"
							placeholder="Informe a descrição da seção"
							value={newSection?.description || ""}
							onChange={(e) => {
								setNewSection({ ...newSection, description: e.target.value });
							}}
						/>
					</div>
				</div>
                <div className="mt-4 flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl text-black font-semibold">Perguntas</h3>
                        <p className="text-sm text-muted-foreground">
                          {questions.length} pergunta{questions.length !== 1 ? 's' : ''} nesta seção
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {questions.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <p className="text-muted-foreground">Nenhuma pergunta adicionada ainda</p>
                          <p className="text-sm text-muted-foreground">Clique em um tipo de pergunta à direita para começar</p>
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
                            <div className="space-y-2">
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
			</div>
            </div>
			<div className="flex flex-col justify-end mb-8">
				<Button
					className="w-full mt-4"
					onClick={() => {
						// Lógica para adicionar a seção
					}}
				>
					Adicionar Seção
				</Button>
				<Button
					className="w-full mt-4 bg-blue-600"
					onClick={() => {
						// Lógica para adicionar a seção
					}}
				>
					Publicar
				</Button>
			</div>
            </div>
            
            {/* Question Editor Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? 'Editar pergunta' : 'Nova pergunta'}
                  </DialogTitle>
                </DialogHeader>
                {editingQuestion && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-title">Pergunta</Label>
                      <Input
                        id="question-title"
                        value={editingQuestion.title}
                        onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})}
                        placeholder="Digite a pergunta"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="question-description">Descrição (opcional)</Label>
                      <Input
                        id="question-description"
                        value={editingQuestion.description || ''}
                        onChange={(e) => setEditingQuestion({...editingQuestion, description: e.target.value})}
                        placeholder="Adicione uma descrição"
                      />
                    </div>

                    {(editingQuestion.type === 'multiple-choice-single' || 
                      editingQuestion.type === 'multiple-choice-multiple' || 
                      editingQuestion.type === 'dropdown' ||
                      editingQuestion.type === 'rating') && (
                      <div className="space-y-2">
                        <Label>Opções</Label>
                        <div className="space-y-2">
                          {editingQuestion.options?.map((option, index) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <Input
                                value={option.label}
                                onChange={(e) => {
                                  const newOptions = [...editingQuestion.options!];
                                  newOptions[index] = { ...option, label: e.target.value };
                                  setEditingQuestion({...editingQuestion, options: newOptions});
                                }}
                                placeholder={`Opção ${index + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
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
                            className="mt-2"
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

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`required-${editingQuestion.id}`}
                          checked={editingQuestion.required}
                          onChange={(e) => setEditingQuestion({...editingQuestion, required: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`required-${editingQuestion.id}`}>Obrigatória</Label>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            
            <div className="hidden md:block w-3/10 p-4 h-full overflow-y-auto border-l border-gray-200">
                <h2 className="text-2xl text-black font-bold mb-2">Opções de perguntas</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Escolha o tipo de pergunta que deseja adicionar
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {QUESTION_TYPES.map((type) => (
                    <div 
                      key={type.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleAddQuestion(type.id as Question['type'])}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg flex-shrink-0">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <div className="ml-8 text-sm text-gray-600">
                        <div className="font-medium">{type.preview.title}</div>
                        <div className="mt-1">
                          {type.preview.type === 'short-text' && (
                            <div className="border-b border-gray-300 py-1 text-gray-400">Resposta curta</div>
                          )}
                          {type.preview.type === 'paragraph' && (
                            <div className="border-b border-gray-300 py-1 text-gray-400">Resposta longa</div>
                          )}
                          {(type.preview.type === 'multiple-choice-single' || 
                            type.preview.type === 'multiple-choice-multiple' || 
                            type.preview.type === 'dropdown') && (
                            <div className="space-y-1 mt-2">
                              {type.preview.options?.map((option, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input 
                                    type={type.preview.type === 'multiple-choice-multiple' ? 'checkbox' : 'radio'} 
                                    disabled
                                    className="h-4 w-4 text-primary border-gray-300"
                                  />
                                  <span>{option.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {type.preview.type === 'rating' && (
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-yellow-400">★</span>
                              ))}
                            </div>
                          )}
                          {(type.preview.type === 'date' || 
                            type.preview.type === 'time' || 
                            type.preview.type === 'datetime') && (
                            <div className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded inline-block mt-1">
                              {type.preview.type === 'date' && 'dd/mm/aaaa'}
                              {type.preview.type === 'time' && '--:--'}
                              {type.preview.type === 'datetime' && 'dd/mm/aaaa --:--'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
		</div>
	);
}