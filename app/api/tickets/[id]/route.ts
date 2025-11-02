import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Ticket, Message } from '@/types/ticket';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;

    // Validate ticket ID format
    if (!ticketId || !/^TKT-[A-Z0-9]+$/.test(ticketId)) {
      return NextResponse.json(
        { error: 'Invalid ticket ID format' },
        { status: 400 }
      );
    }

    // Get ticket details
    const [ticketRows] = await db.execute(
      'SELECT * FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (!Array.isArray(ticketRows) || ticketRows.length === 0) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticket = ticketRows[0] as Ticket;

    // Get messages (exclude internal notes)
    const [messageRows] = await db.execute(
      'SELECT * FROM messages WHERE ticket_id = ? AND is_internal = FALSE ORDER BY created_at ASC',
      [ticketId]
    );

    const messages = messageRows as Message[];

    return NextResponse.json({
      ticket,
      messages,
    });

  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}
