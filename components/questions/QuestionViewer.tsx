// QuestionView.tsx
import { Question } from "../../types/types";
import { ShortTextQuestion, ParagraphQuestion, MultipleChoiceSingleQuestion, MultipleChoiceMultipleQuestion, DropdownQuestion, DateQuestion, TimeQuestion, DatetimeQuestion, RatingQuestion } from "./QuestionTypes";

export function QuestionView({ question }: { question: Question }) {
    switch (question.type) {
        case "short-text":
            return <ShortTextQuestion question={question} />;
        case "paragraph":
            return <ParagraphQuestion question={question} />;
        case "multiple-choice-single":
            return <MultipleChoiceSingleQuestion question={question} />;
        case "multiple-choice-multiple":
            return <MultipleChoiceMultipleQuestion question={question} />;
        case "dropdown":
            return <DropdownQuestion question={question} />;
        case "date":
            return <DateQuestion question={question} />;
        case "time":
            return <TimeQuestion question={question} />;
        case "datetime":
            return <DatetimeQuestion question={question} />;
        case "rating":
            return <RatingQuestion question={question} />;
        default:
            return <div>Tipo de pergunta não suportado</div>;
    }
}