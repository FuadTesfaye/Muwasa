import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await db
      .insert(conversations)
      .values({
        title: 'New Reflection',
        status: 'active',
      })
      .returning();

    return NextResponse.json({ conversation: session[0] });
  } catch (error) {
    // Return ephemeral ID for offline or non-database mode
    return NextResponse.json({
      conversation: {
        id: crypto.randomUUID(),
        title: 'Private Reflection',
        status: 'ephemeral',
        createdAt: new Date().toISOString(),
      },
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      try {
        await db.delete(conversations).where(eq(conversations.id, id));
      } catch (e) {
        // Ephemeral session ignore
      }
    }

    return NextResponse.json({ success: true, message: 'Conversation wiped permanently.' });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
