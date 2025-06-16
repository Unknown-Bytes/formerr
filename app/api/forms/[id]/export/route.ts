import { db } from '@/db/client';
import { form, response, answer, question as questionTable, option as optionTable } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify form ownership
    const formData = await db.query.form.findFirst({
      where: (form, { eq, and }) => 
        and(
          eq(form.id, params.id),
          eq(form.ownerId, user.id)
        )
    });

    if (!formData) {
      return NextResponse.json(
        { error: 'Form not found or access denied' },
        { status: 404 }
      );
    }

    // Get all questions for the form
    const questions = await db.query.question.findMany({
      where: (question, { eq }) => eq(question.sectionId, formData.id),
      with: {
        options: true
      }
    });

    // Get all responses with answers
    const responses = await db.query.response.findMany({
      where: (response) => eq(response.formId, params.id),
      with: {
        answers: {
          with: {
            option: true
          }
        }
      },
      orderBy: (response, { desc }) => [desc(response.submittedAt)]
    });

    if (format === 'csv') {
      return generateCSV(questions, responses);
    }

    // Default to JSON
    return NextResponse.json({
      form: {
        id: formData.id,
        title: formData.title,
        description: formData.description
      },
      questions,
      responses
    });
  } catch (error) {
    console.error('Error exporting form data:', error);
    return NextResponse.json(
      { error: 'Failed to export form data' },
      { status: 500 }
    );
  }
}

function generateCSV(questions: any[], responses: any[]) {
  // Create CSV header
  const headers = ['Response ID', 'Submitted At'];
  const questionMap = new Map();
  
  // Add question headers
  questions.forEach((q, index) => {
    questionMap.set(q.id, index);
    headers.push(q.label);
  });

  // Create CSV rows
  const rows = responses.map(response => {
    const row = [
      response.id,
      new Date(response.submittedAt * 1000).toISOString()
    ];

    // Initialize empty answers for each question
    const answers = new Array(questions.length).fill('');

    // Fill in the answers
    response.answers.forEach((ans: any) => {
      const questionIndex = questionMap.get(ans.questionId);
      if (questionIndex !== undefined) {
        answers[questionIndex] = ans.answer || ans.option?.label || '';
      }
    });

    return [...row, ...answers];
  });

  // Convert to CSV string
  const csvContent = [
    headers.map(header => `"${header.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map((cell: any) => 
      `"${String(cell).replace(/"/g, '""')}"`
    ).join(','))
  ].join('\n');

  // Return CSV file
  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="form-${responses[0]?.formId || 'data'}.csv"`
    }
  });
}
