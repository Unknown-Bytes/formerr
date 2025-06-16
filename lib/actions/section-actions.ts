'use server';

import { db } from '@/db/client';
import { section } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { CreateSectionData, Section } from '@/lib/types/form-types';

export async function createSection(data: CreateSectionData): Promise<{ success: boolean; sectionId?: string; error?: string }> {
  try {
    const [newSection] = await db.insert(section).values({
      title: data.title,
      description: data.description,
      order: data.order,
      formId: data.formId,
    }).returning();

    revalidatePath(`/v1/forms/${data.formId}`);
    return { success: true, sectionId: newSection.id };
  } catch (error) {
    console.error('Error creating section:', error);
    return { success: false, error: 'Failed to create section' };
  }
}

export async function updateSection(
  sectionId: string, 
  data: Partial<CreateSectionData>
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(section)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(section.id, sectionId));

    revalidatePath('/v1/forms');
    return { success: true };
  } catch (error) {
    console.error('Error updating section:', error);
    return { success: false, error: 'Failed to update section' };
  }
}

export async function deleteSection(sectionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(section).where(eq(section.id, sectionId));
    
    revalidatePath('/v1/forms');
    return { success: true };
  } catch (error) {
    console.error('Error deleting section:', error);
    return { success: false, error: 'Failed to delete section' };
  }
}

export async function reorderSections(
  sectionIds: string[], 
  formId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update order for each section
    for (let i = 0; i < sectionIds.length; i++) {
      await db.update(section)
        .set({ order: i, updatedAt: new Date() })
        .where(eq(section.id, sectionIds[i]));
    }

    revalidatePath(`/v1/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error('Error reordering sections:', error);
    return { success: false, error: 'Failed to reorder sections' };
  }
}