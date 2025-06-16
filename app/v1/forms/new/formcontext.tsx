"use client"

import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { 
  createForm, 
  updateForm, 
  publishForm
} from '@/lib/actions/form-actions';
import { 
  createSection, 
  updateSection, 
  deleteSection as deleteSectionAction 
} from '@/lib/actions/section-actions';
import { 
  createQuestion, 
  updateQuestion as updateQuestionAction, 
  deleteQuestion as deleteQuestionAction 
} from '@/lib/actions/question-actions';
import { useRouter } from 'next/navigation';

// Question interface
interface Question {
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
  sectionId: string;
  options?: {
    id: string;
    label: string;
  }[];
}

// Section interface
interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  formId: string;
  questions?: Question[];
  createdAt?: number;
  updatedAt?: number;
}

type newForm = {
    id?: string;
    title: string;
    description: string;
    private: boolean;
    maxResponses: number;
    allowedEmails: string[];
    sections: Section[];
    questions: Question[];
    createdAt?: number;
    updatedAt?: number;
};

const defaultForm: newForm = {
    title: "",
    description: "",
    maxResponses: 0,
    private: false,
    allowedEmails: [],
    sections: [],
    questions: [],
};

type FormContextType = {
    newForm: newForm;
    setNewForm: React.Dispatch<React.SetStateAction<newForm>>;
    addQuestion: (question: Omit<Question, "id">) => void;
    addSection: (section: Omit<Section, "id">) => void;
    getQuestionById: (id: string) => Question | undefined;
    getSectionById: (id: string) => Section | undefined;
    updateQuestion: (id: string, question: Partial<Question>) => void;
    updateSection: (id: string, section: Partial<Section>) => void;
    deleteQuestion: (id: string) => void;
    deleteSection: (id: string) => void;
    saveFormToDatabase: () => Promise<{ success: boolean; formId?: string }>;
    publishFormAction: () => Promise<{ success: boolean }>;
    isLoading: boolean;
};

export const FormContext = createContext<FormContextType | undefined>(undefined);

type FormProviderProps = {
    children: React.ReactNode;
    userId: string;
    initialForm?: newForm;
};

export function FormProvider({ children, userId, initialForm }: FormProviderProps) {
    const [form, setForm] = useState<newForm>(initialForm || defaultForm);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Tudo local - sem async
    const addQuestion = (questionData: Omit<Question, "id">) => {
        const newQuestion: Question = {
            ...questionData,
            id: uuidv4()
        };
        
        setForm(prevForm => ({
            ...prevForm,
            questions: [...prevForm.questions, newQuestion]
        }));
    };

    const addSection = (sectionData: Omit<Section, "id">) => {
        const newSection: Section = {
            ...sectionData,
            id: uuidv4()
        };
        
        setForm(prevForm => ({
            ...prevForm,
            sections: [...prevForm.sections, newSection]
        }));
    };

    const getQuestionById = (id: string): Question | undefined => {
        return form.questions.find(question => question.id === id);
    };

    const getSectionById = (id: string): Section | undefined => {
        return form.sections.find(section => section.id === id);
    };

    const updateQuestion = (id: string, questionUpdate: Partial<Question>) => {
        setForm(prevForm => ({
            ...prevForm,
            questions: prevForm.questions.map(question => 
                question.id === id ? { ...question, ...questionUpdate } : question
            )
        }));
    };

    const updateSection = (id: string, sectionUpdate: Partial<Section>) => {
        setForm(prevForm => ({
            ...prevForm,
            sections: prevForm.sections.map(section => 
                section.id === id ? { ...section, ...sectionUpdate } : section
            )
        }));
    };

    const deleteQuestion = (id: string) => {
        setForm(prevForm => ({
            ...prevForm,
            questions: prevForm.questions.filter(question => question.id !== id)
        }));
    };

    const deleteSection = (id: string) => {
        // Deleta seção e todas as perguntas associadas
        const sectionQuestionIds = form.questions
            .filter(q => q.sectionId === id)
            .map(q => q.id);
        
        setForm(prevForm => ({
            ...prevForm,
            sections: prevForm.sections.filter(section => section.id !== id),
            questions: prevForm.questions.filter(question => !sectionQuestionIds.includes(question.id))
        }));
    };

    // Só salva no banco quando explicitamente chamado
    const saveFormToDatabase = async (): Promise<{ success: boolean; formId?: string }> => {
        setIsLoading(true);
        try {
            let formId = form.id;
            
            // 1. Criar/atualizar formulário
            if (!formId) {
                const formResult = await createForm({
                    title: form.title,
                    description: form.description,
                    isPrivate: form.private,
                    maxResponses: form.maxResponses,
                    allowedEmails: form.allowedEmails,
                    ownerId: userId,
                    emailNotifications: true,
                    passwordProtected: false
                });
                
                if (!formResult.success || !formResult.formId) {
                    setIsLoading(false);
                    return { success: false };
                }
                
                formId = formResult.formId;
                setForm(prev => ({ ...prev, id: formId }));
            }

            // 2. Salvar seções
            const sectionMapping: { [tempId: string]: string } = {};
            
            for (const section of form.sections) {
                const sectionResult = await createSection({
                    title: section.title,
                    description: section.description,
                    order: section.order,
                    formId: formId
                });
                
                if (sectionResult.success && sectionResult.sectionId) {
                    sectionMapping[section.id] = sectionResult.sectionId;
                }
            }

            // 3. Salvar perguntas
            for (const question of form.questions) {
                const realSectionId = sectionMapping[question.sectionId];
                if (!realSectionId) continue;
                
                await createQuestion({
                    title: question.title,
                    description: question.description,
                    type: question.type,
                    required: question.required,
                    order: question.order,
                    sectionId: realSectionId,
                    options: question.options?.map((opt, index) => ({
                        label: opt.label,
                        order: index
                    }))
                });
            }

            setIsLoading(false);
            return { success: true, formId };
        } catch (error) {
            console.error('Failed to save form to database:', error);
            setIsLoading(false);
            return { success: false };
        }
    };

    const publishFormAction = async (): Promise<{ success: boolean }> => {
        setIsLoading(true);
        try {
            // Primeiro salva tudo no banco
            const saveResult = await saveFormToDatabase();
            if (!saveResult.success || !saveResult.formId) {
                setIsLoading(false);
                return { success: false };
            }

            // Depois publica
            const result = await publishForm(saveResult.formId);
            setIsLoading(false);
            
            if (result.success) {
                router.push(`/v1/forms/${saveResult.formId}/publish`);
            }
            
            return result;
        } catch (error) {
            console.error('Failed to publish form:', error);
            setIsLoading(false);
            return { success: false };
        }
    };

    return (
        <FormContext.Provider value={{ 
            newForm: form, 
            setNewForm: setForm,
            addQuestion,
            addSection,
            getQuestionById,
            getSectionById,
            updateQuestion,
            updateSection,
            deleteQuestion,
            deleteSection,
            saveFormToDatabase,
            publishFormAction,
            isLoading
        }}>
            {children}
        </FormContext.Provider>
    )
}

export function useNewForm(){
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useNewForm must be used within a FormProvider.");
    }
    return context;
}