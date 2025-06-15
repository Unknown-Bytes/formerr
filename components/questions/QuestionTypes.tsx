// QuestionTypes.tsx
import { Question } from "../../types/types";

// Short Text
export function ShortTextQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <input disabled placeholder="Resposta curta" className="p-2 border rounded-md w-full" />
        </div>
    )
}

// Paragraph
export function ParagraphQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <textarea disabled placeholder="Resposta longa" className="p-2 border rounded-md w-full" />
        </div>
    )
}

// Multiple-choice (Single)
export function MultipleChoiceSingleQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            {question.options?.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2">
                    <input disabled type="radio" name={question.id} />
                    {opt.label}
                </label>
            ))}
        </div>
    )
}

// Multiple-choice (Multiple)
export function MultipleChoiceMultipleQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            {question.options?.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2">
                    <input disabled type="checkbox" name={`${question.id}[]`} />
                    {opt.label}
                </label>
            ))}
        </div>
    )
}

// Dropdown
export function DropdownQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <select disabled className="p-2 border rounded-md w-full">
                {question.options?.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

// Date
export function DateQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <input disabled type="date" className="p-2 border rounded-md w-full" />
        </div>
    )
}

// Time
export function TimeQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <input disabled type="time" className="p-2 border rounded-md w-full" />
        </div>
    )
}

// Datetime
export function DatetimeQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            <input disabled type="datetime-local" className="p-2 border rounded-md w-full" />
        </div>
    )
}

// Rating
export function RatingQuestion({ question }: { question: Question }) {
    return (
        <div className="flex flex-col gap-2">
            <label>{question.title}</label>
            {/* Apenas um exemplo: mostrando 5 estrelas vazias */}
            <div className="flex gap-1">
                {new Array(5).fill(0).map((_, i) => (
                    <span key={i} aria-disabled="true">
                        ⭐
                    </span>
                ))}
            </div>
        </div>
    )
}