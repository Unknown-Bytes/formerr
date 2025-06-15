import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useFormBuilder } from "@/old/FormBuilderContext";
import { useState, KeyboardEvent } from "react";

type Visibility = 'public' | 'private';

export function FormSetup({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useFormBuilder();
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handleAddEmail = (): void => {
    if (!emailInput) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (formData.authorizedEmails.includes(emailInput)) {
      setEmailError("This email is already added");
      return;
    }

    updateFormData({
      authorizedEmails: [...formData.authorizedEmails, emailInput],
    });
    setEmailInput("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string): void => {
    updateFormData({
      authorizedEmails: formData.authorizedEmails.filter(email => email !== emailToRemove),
    });
  };

  const isFormValid = formData.title.trim() !== "" && 
    (formData.visibility === "public" || formData.authorizedEmails.length > 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Form Title *</Label>
        <Input
          id="title"
          placeholder="Enter form title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter form description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Visibilidade *</Label>
        <RadioGroup
            value={formData.visibility}
            onValueChange={(value: string) => {
                if (value === 'public' || value === 'private') {
                  updateFormData({ visibility: value });
                }
            }}
            className="space-y-2">

            <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">
                    Public - Anyone with the link can respond
                </Label>
            </div>

            <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">
                    Private - Only specific people can respond
                </Label>
            </div>
        </RadioGroup>

        {formData.visibility === "private" &&(
            <div className="space-y-2 mt-4">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.currentTarget.value) {
                                    updateFormData({
                                      authorizedEmails: [
                                        ...formData.authorizedEmails,
                                        e.currentTarget.value,
                                      ],
                                    });
                                    e.currentTarget.value = '';
                                }
                           }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            const input = document.querySelector("#email") as HTMLInputElement;
                            if (input && input.value) {
                                updateFormData({
                                  authorizedEmails: [
                                    ...formData.authorizedEmails,
                                    input.value,
                                  ],
                                });
                                input.value = '';
                            }
                       }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        Add
                    </button>
                </div>

                {formData.authorizedEmails.length > 0 &&(
                    <div className="mt-2 space-y-1">
                        {formData.authorizedEmails.map((email) =>(
                            <div
                                key={email}
                                className="flex items-center justify-between bg-muted/50 p-2 rounded">
                                <span className="text-sm">{email}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEmail(email)}
                                    className="text-muted-foreground hover:text-foreground">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Máximo de respostas */}
                <div className="flex flex-col mt-4">
                    <Label htmlFor="maxResponses">
                        Quantidade Máxima de Respostas
                    </Label>
                    <Input
                        id="maxResponses"
                        name="maxResponses"
                        type="number"
                        min="1"
                        value={(formData as any).maxResponses || ''}
                        onChange={(e) => updateFormData({ maxResponses: parseInt(e.target.value, 10) })}
                        placeholder="Deixe vazio para ilimitado"
                    />
                </div>

            </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-4 py-2 rounded-md ${
            isFormValid
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          } transition-colors`}
        >
          Next: Add Questions
        </button>
      </div>
    </div>
  );
}
