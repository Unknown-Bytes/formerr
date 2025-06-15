'use client';

import { FormBuilderProvider } from '@/old/FormBuilderContext';
import { FormSetup } from '@/old/forms/FormSetup';
import { QuestionBuilder } from '@/old/forms/QuestionBuilder';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NewFormPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  const handlePublish = async () => {
    // In a real app, you would make an API call to save the form
    // For now, we'll just log the form data and redirect to the forms list
    router.push('/v1/forms');
  };

  return (
    <div className='h-dvh overflow-y-auto'> 
        <FormBuilderProvider>
      <div className="container mx-auto py-6 px-4 h-dvh">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Create New Form</h1>
            <p className="text-muted-foreground">
              {step === 1 ? 'Basic Information' : 'Add Questions'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/v1/forms')}
            >
              Cancel
            </Button>
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
            
            <div className="flex flex-col items-center relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="mt-2 text-sm font-medium">Setup</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-muted" />
            
            <div className="flex flex-col items-center relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="mt-2 text-sm font-medium">Questions</span>
            </div>
          </div>

          {/* Form content */}
          <div className="bg-background rounded-lg border p-6">
            {step === 1 ? (
              <FormSetup onNext={() => setStep(2)} />
            ) : (
              <QuestionBuilder onPublish={handlePublish} />
            )}
          </div>
        </div>
      </div>
    </FormBuilderProvider>
    </div>
  );
}
