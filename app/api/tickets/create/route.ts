import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateTicketId } from '@/lib/ticket-utils';
import type { TicketCategory } from '@/types/ticket';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Validation
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0 || message.length > 10000) {
      return NextResponse.json(
        { error: 'Message must be between 1 and 10000 characters' },
        { status: 400 }
      );
    }

    // Generate unique ticket ID
    const ticketId = generateTicketId();

    // Default category for all tickets
    const category = 'technical';

    // Auto-generate subject from ticket ID
    const subject = `Support Request - ${ticketId}`;

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create ticket
      await connection.execute(
        `INSERT INTO tickets (id, category, subject, status, priority, last_reply_by)
         VALUES (?, ?, ?, 'open', 'medium', 'user')`,
        [ticketId, category, subject]
      );

      // Add initial message
      await connection.execute(
        `INSERT INTO messages (ticket_id, message, sender_type)
         VALUES (?, ?, 'user')`,
        [ticketId, message]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({
        success: true,
        ticketId,
        message: 'Ticket created successfully',
      }, { status: 201 });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
