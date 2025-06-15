import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Visibility = 'public' | 'private';

export type FormBlock = {
  id: string;
  type: 'multiple_choice' | 'text' | 'scale' | 'date' | 'dropdown';
  question: string;
  required: boolean;
  options: string[]; // Made required
  min?: number;
  max?: number;
  step?: number;
};

type FormData = {
  title: string;
  description: string;
  visibility: Visibility;
  authorizedEmails: string[];
  blocks: FormBlock[];
};

type FormBuilderContextType = {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  addBlock: (block: Omit<FormBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<FormBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
};

const defaultFormData: FormData = {
  title: '',
  description: '',
  visibility: 'public',
  authorizedEmails: [],
  blocks: [],
};

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const FormBuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const addBlock = (block: Omit<FormBlock, 'id'>) => {
    try {
      const newBlock = {
        ...block,
        id: `block-${uuidv4()}`,
      };
      
      console.log('Adding block with ID:', newBlock.id);
      
      setFormData(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock],
      }));
    } catch (error) {
      console.error('Error in addBlock:', error);
    }
  };

  const updateBlock = (id: string, updates: Partial<FormBlock>) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  };

  const removeBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id),
    }));
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    const result = Array.from(formData.blocks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setFormData(prev => ({
      ...prev,
      blocks: result,
    }));
  };

  return (
    <FormBuilderContext.Provider
      value={{
        formData,
        updateFormData,
        addBlock,
        updateBlock,
        removeBlock,
        reorderBlocks,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};
