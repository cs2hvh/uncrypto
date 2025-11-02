import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function PATCH(
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
    const { status, priority } = body;

    const updates: string[] = [];
    const queryParams: any[] = [];

    if (status) {
      if (!['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updates.push('status = ?');
      queryParams.push(status);
    }

    if (priority) {
      if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return NextResponse.json(
          { error: 'Invalid priority' },
          { status: 400 }
        );
      }
      updates.push('priority = ?');
      queryParams.push(priority);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    queryParams.push(ticketId);

    await db.execute(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
      queryParams
    );

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete ticket (CASCADE will delete messages and notes)
    const [result]: any = await db.execute(
      'DELETE FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
