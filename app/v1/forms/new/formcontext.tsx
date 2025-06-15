"use client"

import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from uuid package

// Question interface with the added sectionId field
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
  sectionId: string; // New field to associate with a section
  options?: {
    id: string;
    label: string;
  }[];
}

// Section interface with the formId field
interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  formId: string; // Non-optional now
  questions?: Question[];
  createdAt?: number;
  updatedAt?: number;
}

type newForm = {
    title: string;
    description: string;
    private: boolean;
    maxResponses: number;
    allowedEmails: string[];
    sections: Section[]; // Added sections to the form
    questions: Question[]; // Added questions to the form
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
    // Helper methods to work with complete objects
    addQuestion: (question: Omit<Question, "id">) => string;
    addSection: (section: Omit<Section, "id">) => string;
    getQuestionById: (id: string) => Question | undefined;
    getSectionById: (id: string) => Section | undefined;
    updateQuestion: (id: string, question: Partial<Question>) => void;
    updateSection: (id: string, section: Partial<Section>) => void;
    deleteQuestion: (id: string) => void;
    deleteSection: (id: string) => void;
};

export const FormContext = createContext<FormContextType | undefined>(undefined);

type FormProviderProps = {
    children: React.ReactNode;
};

export function FormProvider({ children }: FormProviderProps) {
    const [form, setForm] = useState<newForm>(defaultForm);

    // Helper functions to work with complete objects
    const addQuestion = (questionData: Omit<Question, "id">): string => {
        const id = uuidv4(); // Use uuidv4() from the uuid package
        const newQuestion: Question = {
            ...questionData,
            id
        };
        
        setForm(prevForm => ({
            ...prevForm,
            questions: [...prevForm.questions, newQuestion]
        }));
        
        return id;
    };

    const addSection = (sectionData: Omit<Section, "id">): string => {
        const id = uuidv4(); // Use uuidv4() from the uuid package
        const newSection: Section = {
            ...sectionData,
            id
        };
        
        setForm(prevForm => ({
            ...prevForm,
            sections: [...prevForm.sections, newSection]
        }));
        
        return id;
    };

    const getQuestionById = (id: string): Question | undefined => {
        return form.questions.find(question => question.id === id);
    };

    const getSectionById = (id: string): Section | undefined => {
        return form.sections.find(section => section.id === id);
    };

    const updateQuestion = (id: string, questionUpdate: Partial<Question>): void => {
        setForm(prevForm => ({
            ...prevForm,
            questions: prevForm.questions.map(question => 
                question.id === id ? { ...question, ...questionUpdate } : question
            )
        }));
    };

    const updateSection = (id: string, sectionUpdate: Partial<Section>): void => {
        setForm(prevForm => ({
            ...prevForm,
            sections: prevForm.sections.map(section => 
                section.id === id ? { ...section, ...sectionUpdate } : section
            )
        }));
    };

    const deleteQuestion = (id: string): void => {
        setForm(prevForm => ({
            ...prevForm,
            questions: prevForm.questions.filter(question => question.id !== id)
        }));
    };

    const deleteSection = (id: string): void => {
        // When deleting a section, also delete all questions associated with it
        const sectionQuestionIds = form.questions
            .filter(q => q.sectionId === id)
            .map(q => q.id);
        
        setForm(prevForm => ({
            ...prevForm,
            sections: prevForm.sections.filter(section => section.id !== id),
            questions: prevForm.questions.filter(question => !sectionQuestionIds.includes(question.id))
        }));
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
            deleteSection
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