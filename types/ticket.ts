export type TicketCategory = 'technical' | 'billing' | 'sales' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SenderType = 'user' | 'admin';

export interface Ticket {
  id: string;
  category: TicketCategory;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  last_reply_at: string;
  last_reply_by: SenderType;
}

export interface Message {
  id: number;
  ticket_id: string;
  message: string;
  sender_type: SenderType;
  admin_name?: string | null;
  created_at: string;
  is_internal: boolean;
}

export interface AdminNote {
  id: number;
  ticket_id: string;
  note: string;
  admin_name: string;
  created_at: string;
}

export interface TicketWithMessages extends Ticket {
  messages: Message[];
}
