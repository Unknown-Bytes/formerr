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

    const settings = await request.json();
    
    // Prepare the update data
    const updateData: any = {
      updatedAt: Math.floor(Date.now() / 1000)
    };

    // Map settings to database fields
    if ('thankYouMessage' in settings) {
      updateData.customThankYou = settings.thankYouMessage;
    }
    if ('redirectUrl' in settings) {
      updateData.redirectUrl = settings.redirectUrl;
    }
    if ('passwordProtected' in settings) {
      updateData.passwordProtected = settings.passwordProtected ? 1 : 0;
    }
    if ('formPassword' in settings) {
      updateData.formPassword = settings.formPassword;
    }
    if ('emailNotifications' in settings) {
      updateData.emailNotifications = settings.emailNotifications ? 1 : 0;
    }
    if ('webhookUrl' in settings) {
      updateData.webhookUrl = settings.webhookUrl;
    }
    if ('expirationDate' in settings) {
      updateData.expireAt = settings.expirationDate 
        ? Math.floor(new Date(settings.expirationDate).getTime() / 1000)
        : null;
    }

    const [updatedForm] = await db
      .update(form)
      .set(updateData)
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
    console.error('Error updating form settings:', error);
    return NextResponse.json(
      { error: 'Failed to update form settings' },
      { status: 500 }
    );
  }
}
