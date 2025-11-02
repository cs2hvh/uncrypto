import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin token
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: ticketId } = await params;
    const body = await request.json();
    const { message, isInternal = false } = body;

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

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Add message
      await connection.execute(
        `INSERT INTO messages (ticket_id, message, sender_type, admin_name, is_internal)
         VALUES (?, ?, 'admin', ?, ?)`,
        [ticketId, message, admin.name, isInternal]
      );

      // Update ticket (only if not internal note)
      if (!isInternal) {
        await connection.execute(
          `UPDATE tickets
           SET last_reply_at = CURRENT_TIMESTAMP,
               last_reply_by = 'admin'
           WHERE id = ?`,
          [ticketId]
        );
      }

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
