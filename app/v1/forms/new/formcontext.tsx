"use client"

import { createContext, useContext, useState } from "react";

type newForm = {
    title: string;
    description: string;
    private: boolean;
    maxResponses: number;
    allowedEmails: string[];
};

const defaultForm: newForm = {
    title: "",
    description: "",
    maxResponses: 0,
    private: false,
    allowedEmails: [],
};

type FormContextType = {
    newForm: newForm;
    setNewForm: React.Dispatch<React.SetStateAction<newForm>>;
};

export const FormContext = createContext<FormContextType | undefined>(undefined);

type FormProviderProps = {
    children: React.ReactNode;
};

export function FormProvider({ children }: FormProviderProps)  {
    const [form, setForm] = useState<newForm>(defaultForm);

    return (
        <FormContext.Provider value={{ newForm: form, setNewForm: setForm }}>
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