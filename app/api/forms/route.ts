import { db } from '@/db/client';
import { form, section, question, option } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { 
      title, 
      description, 
      sections = [],
      questions = [],
      settings = {}
    } = data;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Create the form
      const [newForm] = await tx.insert(form).values({
        title,
        description,
        ownerId: user.id,
        status: 'draft',
        ...settings,
        publishedAt: settings.status === 'active' ? Math.floor(Date.now() / 1000) : null,
        updatedAt: Math.floor(Date.now() / 1000)
      }).returning();

      // Process sections and questions if provided
      if (sections.length > 0 && questions.length > 0) {
        // Create sections
        const sectionInserts = sections.map((sec: any) => ({
          formId: newForm.id,
          title: sec.title,
          description: sec.description,
          order: sec.order
        }));
        
        const createdSections = await tx.insert(section)
          .values(sectionInserts)
          .returning();

        // Create questions with options
        for (const q of questions) {
          const section = createdSections.find(s => s.order === q.sectionOrder);
          if (!section) continue;
          
          const [createdQuestion] = await tx.insert(question).values({
            sectionId: section.id,
            label: q.label,
            type: q.type,
            required: q.required ? 1 : 0,
            order: q.order
          }).returning();

          if (q.options?.length > 0) {
            const optionInserts = q.options.map((opt: any) => ({
              questionId: createdQuestion.id,
              label: opt.label
            }));
            
            await tx.insert(option).values(optionInserts);
          }
        }
      }


      return newForm;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const forms = await db.query.form.findMany({
      where: (form, { eq }) => eq(form.ownerId, user.id),
      orderBy: (form, { desc }) => [desc(form.updatedAt)]
    });

    return NextResponse.json({ data: forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}
