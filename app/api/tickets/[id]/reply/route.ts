import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json();
    const { message } = body;

    // Validate ticket ID format
    if (!ticketId || !/^TKT-[A-Z0-9]+$/.test(ticketId)) {
      return NextResponse.json(
        { error: 'Invalid ticket ID format' },
        { status: 400 }
      );
    }

    // Validation
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message is too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const [ticketRows] = await db.execute(
      'SELECT id, status FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (!Array.isArray(ticketRows) || ticketRows.length === 0) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticket = ticketRows[0] as any;

    // Don't allow replies to closed tickets
    if (ticket.status === 'closed') {
      return NextResponse.json(
        { error: 'Cannot reply to a closed ticket' },
        { status: 400 }
      );
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Add message
      await connection.execute(
        `INSERT INTO messages (ticket_id, message, sender_type)
         VALUES (?, ?, 'user')`,
        [ticketId, message]
      );

      // Update ticket
      await connection.execute(
        `UPDATE tickets
         SET last_reply_at = CURRENT_TIMESTAMP,
             last_reply_by = 'user',
             status = CASE
               WHEN status = 'waiting_customer' THEN 'open'
               WHEN status = 'resolved' THEN 'open'
               ELSE status
             END
         WHERE id = ?`,
        [ticketId]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({
        success: true,
        message: 'Reply added successfully',
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}
