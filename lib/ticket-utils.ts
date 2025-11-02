// Generate unique ticket ID (format: TKT-XXXXXX)
export function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}${random}`;
}

// Ticket status colors
export const statusColors = {
  open: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  in_progress: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  waiting_customer: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  resolved: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
};

// Category colors
export const categoryColors = {
  technical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  billing: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  sales: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  other: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
};

// Priority colors
export const priorityColors = {
  low: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  medium: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  urgent: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

// Format status for display
export function formatStatus(status: string): string {
  return status.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// Format full timestamp
export function formatTimestamp(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
