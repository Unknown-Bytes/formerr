import { db } from '@/db/client';
import { form } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    
    if (!['draft', 'active', 'paused', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const [updatedForm] = await db
      .update(form)
      .set({
        status,
        ...(status === 'active' && { publishedAt: Math.floor(Date.now() / 1000) }),
        updatedAt: Math.floor(Date.now() / 1000)
      })
      .where(
        and(
          eq(form.id, params.id),
          eq(form.ownerId, user.id)
        )
      )
      .returning();

    if (!updatedForm) {
      return NextResponse.json(
        { error: 'Form not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedForm });
  } catch (error) {
    console.error('Error updating form status:', error);
    return NextResponse.json(
      { error: 'Failed to update form status' },
      { status: 500 }
    );
  }
}
