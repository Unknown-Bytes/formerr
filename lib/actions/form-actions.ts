'use server';

import { db } from '@/db/client';
import { form, section, question, option, formAnalytics } from '@/db/schema';
import { eq, and, desc, sql, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { 
  CreateFormData, 
  FormWithRelations, 
  FormStats,
  Form 
} from '@/lib/types/form-types';
import { hash } from 'bcrypt';

export async function createForm(data: CreateFormData): Promise<{ success: boolean; formId?: string; error?: string }> {
  try {
    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.passwordProtected && data.formPassword) {
      hashedPassword = await hash(data.formPassword, 10);
    }

    const [newForm] = await db.insert(form).values({
      title: data.title,
      description: data.description,
      ownerId: data.ownerId,
      isPrivate: data.isPrivate,
      maxResponses: data.maxResponses,
      allowedEmails: data.allowedEmails,
      thankYouMessage: data.thankYouMessage,
      redirectUrl: data.redirectUrl,
      emailNotifications: data.emailNotifications,
      webhookUrl: data.webhookUrl,
      passwordProtected: data.passwordProtected,
      formPassword: hashedPassword,
      status: 'draft',
    }).returning();

    revalidatePath('/v1/dashboard');
    return { success: true, formId: newForm.id };
  } catch (error) {
    console.error('Error creating form:', error);
    return { success: false, error: 'Failed to create form' };
  }
}

export async function updateForm(
  formId: string, 
  data: Partial<CreateFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.passwordProtected && data.formPassword) {
      hashedPassword = await hash(data.formPassword, 10);
    }

    await db.update(form)
      .set({
        ...data,
        formPassword: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(form.id, formId));

    revalidatePath('/v1/forms');
    revalidatePath(`/v1/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating form:', error);
    return { success: false, error: 'Failed to update form' };
  }
}

export async function publishForm(formId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(form)
      .set({
        status: 'active',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(form.id, formId));

    revalidatePath('/v1/forms');
    revalidatePath(`/v1/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error('Error publishing form:', error);
    return { success: false, error: 'Failed to publish form' };
  }
}

export async function updateFormStatus(
  formId: string, 
  status: 'draft' | 'active' | 'paused' | 'archived'
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(form)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(form.id, formId));

    revalidatePath('/v1/forms');
    revalidatePath(`/v1/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating form status:', error);
    return { success: false, error: 'Failed to update form status' };
  }
}

export async function getFormWithRelations(formId: string): Promise<FormWithRelations | null> {
  try {
    const formData = await db.query.form.findFirst({
      where: eq(form.id, formId),
      with: {
        sections: {
          orderBy: [asc(section.order)],
          with: {
            questions: {
              orderBy: [asc(question.order)],
              with: {
                options: {
                  orderBy: [asc(option.order)],
                },
              },
            },
          },
        },
      },
    });

    if (!formData) return null;

    // Get response count and views
    const stats = await getFormStats(formId);

    return {
      ...formData,
      _count: {
        responses: stats.responses,
        views: stats.views,
      },
    } as FormWithRelations;
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
}

export async function getFormsbyUser(userId: string): Promise<Form[]> {
  try {
    const forms = await db.query.form.findMany({
      where: eq(form.ownerId, userId),
      orderBy: [desc(form.updatedAt)],
    });

    return forms;
  } catch (error) {
    console.error('Error fetching user forms:', error);
    return [];
  }
}

export async function getForm(formId: string): Promise<{
  success: boolean;
  form?: any;
  error?: string;
}> {
  try {
    // Get form with all relations
    const formData = await db.query.form.findFirst({
      where: eq(form.id, formId),
      with: {
        sections: {
          orderBy: [asc(section.order)],
          with: {
            questions: {
              orderBy: [asc(question.order)],
              with: {
                options: {
                  orderBy: [asc(option.order)]
                }
              }
            }
          }
        }
      }
    });

    if (!formData) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    // Transform the data to match our interface
    const transformedForm = {
      ...formData,
      sections: formData.sections.map(sec => ({
        ...sec,
        questions: sec.questions.map(q => ({
          ...q,
          options: q.options.map(opt => ({
            id: opt.id,
            label: opt.label
          }))
        }))
      })),
      // Flatten questions for easier access
      questions: formData.sections.flatMap(sec => 
        sec.questions.map(q => ({
          ...q,
          options: q.options.map(opt => ({
            id: opt.id,
            label: opt.label
          }))
        }))
      )
    };

    return {
      success: true,
      form: transformedForm
    };
  } catch (error) {
    console.error('Error getting form:', error);
    return {
      success: false,
      error: 'Failed to get form'
    };
  }
}

export async function deleteForm(formId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(form).where(eq(form.id, formId));
    
    revalidatePath('/v1/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting form:', error);
    return { success: false, error: 'Failed to delete form' };
  }
}

export async function getFormStats(formId: string): Promise<FormStats> {
  try {
    // Get basic stats from analytics table
    const analyticsData = await db.query.formAnalytics.findMany({
      where: eq(formAnalytics.formId, formId),
      orderBy: [desc(formAnalytics.date)],
      limit: 7,
    });

    const totalViews = analyticsData.reduce((sum: number, day: any) => sum + day.views, 0);
    const totalResponses = analyticsData.reduce((sum: number, day: any) => sum + day.completedResponses, 0);
    const avgCompletionTime = analyticsData.length > 0 
      ? Math.round(analyticsData.reduce((sum: number, day: any) => sum + day.avgCompletionTime, 0) / analyticsData.length)
      : 0;

    const conversionRate = totalViews > 0 ? (totalResponses / totalViews) * 100 : 0;

    return {
      views: totalViews,
      responses: totalResponses,
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgCompletionTime: formatTime(avgCompletionTime),
      dailyResponses: analyticsData.reverse().map((day: any) => ({
        date: day.date,
        responses: day.completedResponses,
      })),
    };
  } catch (error) {
    console.error('Error fetching form stats:', error);
    return {
      views: 0,
      responses: 0,
      conversionRate: 0,
      avgCompletionTime: '0m 0s',
      dailyResponses: [],
    };
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}