'use server';

import { db } from '@/db/client';
import { question, option } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { CreateQuestionData, Question } from '@/lib/types/form-types';

export async function createQuestion(data: CreateQuestionData): Promise<{ success: boolean; questionId?: string; error?: string }> {
  try {
    const [newQuestion] = await db.insert(question).values({
      title: data.title,
      description: data.description,
      type: data.type,
      required: data.required,
      order: data.order,
      sectionId: data.sectionId,
    }).returning();

    // Create options if provided
    if (data.options && data.options.length > 0) {
      await db.insert(option).values(
        data.options.map(opt => ({
          label: opt.label,
          order: opt.order,
          questionId: newQuestion.id,
        }))
      );
    }

    revalidatePath('/v1/forms');
    return { success: true, questionId: newQuestion.id };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

export async function updateQuestion(
  questionId: string, 
  data: Partial<CreateQuestionData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update question
    await db.update(question)
      .set({
        title: data.title,
        description: data.description,
        type: data.type,
        required: data.required,
        order: data.order,
        updatedAt: new Date(),
      })
      .where(eq(question.id, questionId));

    // Update options if provided
    if (data.options) {
      // Delete existing options
      await db.delete(option).where(eq(option.questionId, questionId));
      
      // Insert new options
      if (data.options.length > 0) {
        await db.insert(option).values(
          data.options.map(opt => ({
            label: opt.label,
            order: opt.order,
            questionId: questionId,
          }))
        );
      }
    }

    revalidatePath('/v1/forms');
    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

export async function deleteQuestion(questionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(question).where(eq(question.id, questionId));
    
    revalidatePath('/v1/forms');
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}

export async function reorderQuestions(
  questionIds: string[], 
  sectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update order for each question
    for (let i = 0; i < questionIds.length; i++) {
      await db.update(question)
        .set({ order: i, updatedAt: new Date() })
        .where(eq(question.id, questionIds[i]));
    }

    revalidatePath('/v1/forms');
    return { success: true };
  } catch (error) {
    console.error('Error reordering questions:', error);
    return { success: false, error: 'Failed to reorder questions' };
  }
}