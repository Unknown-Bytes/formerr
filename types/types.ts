export type Question = {
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