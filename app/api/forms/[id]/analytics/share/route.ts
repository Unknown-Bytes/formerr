import { db } from '@/db/client';
import { form, formAnalytics } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform } = await request.json();
    
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

    // Log the share event
    await db.insert(formAnalytics).values({
      formId: params.id,
      eventType: 'share',
      eventData: { platform },
      timestamp: Math.floor(Date.now() / 1000)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging share event:', error);
    return NextResponse.json(
      { error: 'Failed to log share event' },
      { status: 500 }
    );
  }
}
