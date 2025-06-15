import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder, FormBlock } from "@/old/FormBuilderContext";
import { Plus, Trash2 } from "lucide-react";
import { useState, ReactNode } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "react-beautiful-dnd";

export type BlockType = 'multiple_choice' | 'text' | 'scale' | 'date' | 'dropdown';

type BlockTemplates = Record<BlockType, Omit<FormBlock, 'id' | 'type'>>;

const blockTemplates: BlockTemplates = {
  multiple_choice: {
    question: "Multiple Choice",
    options: ["Option 1"],
    required: false,
  },
  text: {
    question: "Text Answer",
    options: [],
    required: false,
  },
  scale: {
    question: "Scale",
    options: [],
    min: 1,
    max: 5,
    step: 1,
    required: false,
  },
  date: {
    question: "Date",
    options: [],
    required: false,
  },
  dropdown: {
    question: "Dropdown",
    options: ["Option 1"],
    required: false,
  },
};

export function QuestionBuilder({ onPublish }: { onPublish: () => void }) {
  const { formData, addBlock, updateBlock, removeBlock, reorderBlocks } = useFormBuilder();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const handlePublish = (): void => {
    onPublish();
  };

  const handleAddBlock = (type: BlockType): void => {
    try {
      const template = blockTemplates[type];
      if (!template) {
        console.error('Invalid block type:', type);
        return;
      }
      
      // Create a new block without an ID - the context will add one
      const newBlock = {
        type,
        question: template.question,
        required: template.required || false,
        options: Array.isArray(template.options) ? [...template.options] : [],
        ...(template.min !== undefined && { min: template.min }),
        ...(template.max !== undefined && { max: template.max }),
        ...(template.step !== undefined && { step: template.step }),
      };
      
      console.log('Adding new block:', newBlock);
      addBlock(newBlock);
      
      // Close the drawer after adding a block
      setIsDrawerOpen(false);
      
      // Scroll to the bottom to show the newly added block
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    
    reorderBlocks(result.source.index, result.destination.index);
  };

  const renderBlockContent = (block: FormBlock): ReactNode => {
    // Get options with type safety
    const options = block.options || [];
    
    switch (block.type) {
      case 'multiple_choice':
      case 'dropdown':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-border" />
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...block.options];
                    newOptions[index] = e.target.value;
                    updateBlock(block.id, { options: newOptions });
                  }}
                  className="border-0 shadow-none focus-visible:ring-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newOptions = options.filter((_, i) => i !== index);
                    updateBlock(block.id, { options: newOptions });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newOptions = [...options, `Option ${options.length + 1}`];
                updateBlock(block.id, { options: newOptions });
              }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add option
            </button>
          </div>
        );
        
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24">
                <Label>Min</Label>
                <Input
                  type="number"
                  value={block.min}
                  onChange={(e) => updateBlock(block.id, { min: Number(e.target.value) })}
                />
              </div>
              <div className="w-24">
                <Label>Max</Label>
                <Input
                  type="number"
                  value={block.max}
                  onChange={(e) => updateBlock(block.id, { max: Number(e.target.value) })}
                />
              </div>
              <div className="w-24">
                <Label>Step</Label>
                <Input
                  type="number"
                  value={block.step}
                  onChange={(e) => updateBlock(block.id, { step: Number(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/50"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{block.min || 1}</span>
              <span>{block.max || 5}</span>
            </div>
          </div>
        );
        
      case 'date':
        return (
          <div className="border rounded-md p-2 w-fit">
            <span className="text-sm text-muted-foreground">Date picker will appear here</span>
          </div>
        );
        
      case 'text':
        return (
          <Input
            placeholder="Text answer"
            disabled
            className="border-0 border-b rounded-none shadow-none"
          />
        );
        
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24">
                <Label>Min</Label>
                <Input
                  type="number"
                  value={block.min}
                  onChange={(e) => updateBlock(block.id, { min: Number(e.target.value) })}
                />
              </div>
              <div className="w-24">
                <Label>Max</Label>
                <Input
                  type="number"
                  value={block.max}
                  onChange={(e) => updateBlock(block.id, { max: Number(e.target.value) })}
                />
              </div>
              <div className="w-24">
                <Label>Step</Label>
                <Input
                  type="number"
                  value={block.step}
                  onChange={(e) => updateBlock(block.id, { step: Number(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/50"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{block.min}</span>
              <span>{block.max}</span>
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="border rounded-md p-2 w-fit">
            <span className="text-sm text-muted-foreground">Date picker will appear here</span>
          </div>
        );
      case 'text':
        return (
          <Input
            placeholder="Text answer"
            disabled
            className="border-0 border-b rounded-none shadow-none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Main content area */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-20">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable 
            droppableId="blocks"
            direction="vertical"
            type="DEFAULT"
          >
            {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {formData.blocks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No questions added yet. Click the + button below to add one.</p>
                </div>
              ) : (
                formData.blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative p-6 border rounded-lg bg-background ${
                          selectedBlock === block.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedBlock(block.id)}
                      >
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBlock(block.id);
                              if (selectedBlock === block.id) {
                                setSelectedBlock(null);
                              }
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div {...provided.dragHandleProps} className="p-1 text-muted-foreground cursor-grab">
                            <div className="w-4 h-4">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 18H16M8 12H16M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <Input
                            value={block.question}
                            onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                            className="text-lg font-medium border-0 shadow-none focus-visible:ring-1"
                            placeholder="Question"
                          />
                          
                          {renderBlockContent(block)}
                          
                          <div className="flex justify-end pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`required-${block.id}`} className="text-sm">
                                Required
                              </Label>
                              <Switch
                                id={`required-${block.id}`}
                                checked={block.required}
                                onCheckedChange={(checked: boolean) => updateBlock(block.id, { required: checked })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

      {/* Mobile FAB - Fixed position with high z-index */}
      <div className="fixed bottom-4 right-6 z-[9999] md:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Add question"
          style={{ 
            display: isDrawerOpen ? 'none' : 'flex',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
          }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 overflow-y-auto transition-transform duration-300"
            onClick={(e) => {
              e.stopPropagation();
              return false;
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Add question</h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
                aria-label="Close drawer"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries({
                multiple_choice: 'Multiple Choice',
                text: 'Text',
                scale: 'Scale',
                date: 'Date',
                dropdown: 'Dropdown',
              }).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    handleAddBlock(type as BlockType);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-md hover:bg-muted/50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    {type === 'multiple_choice' && <span className="text-muted-foreground">A</span>}
                    {type === 'text' && <span className="text-muted-foreground">T</span>}
                    {type === 'scale' && <span className="text-muted-foreground">1-5</span>}
                    {type === 'date' && <span className="text-muted-foreground">📅</span>}
                    {type === 'dropdown' && <span className="text-muted-foreground">▼</span>}
                  </div>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop add button */}
      <div className="hidden md:block mt-6">
        <button
          type="button"
          onClick={() => {
            handleAddBlock('multiple_choice');
            // Scroll to bottom to see the new question
            setTimeout(() => {
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
              });
            }, 100);
          }}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add question</span>
        </button>
      </div>
      
      {/* Options Sidebar - Desktop */}
      <div className="hidden md:block w-1/5 pl-6 pr-4 py-6 border-l h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <h3 className="font-medium mb-4">Add Question</h3>
        <div className="space-y-2">
          {Object.entries({
            multiple_choice: 'Multiple Choice',
            text: 'Text',
            scale: 'Scale',
            date: 'Date',
            dropdown: 'Dropdown',
          }).map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddBlock(type as BlockType)}
              className="w-full text-left p-3 rounded-md hover:bg-muted/50 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                {type === 'multiple_choice' && <span className="text-muted-foreground">A</span>}
                {type === 'text' && <span className="text-muted-foreground">T</span>}
                {type === 'scale' && <span className="text-muted-foreground">1-5</span>}
                {type === 'date' && <span className="text-muted-foreground">📅</span>}
                {type === 'dropdown' && <span className="text-muted-foreground">▼</span>}
              </div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Publish button */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:right-[20%] bg-background border-t p-4 flex justify-end z-40">
        <Button 
          onClick={onPublish}
          disabled={formData.blocks.length === 0}
          className="px-6 w-full md:w-auto"
        >
          Publish Form
        </Button>
      </div>
    </div>
  );
}
