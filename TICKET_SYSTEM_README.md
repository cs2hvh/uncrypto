# UnCrypto Ticket Support System

A professional, anonymous ticket support system built with Next.js 16 and MySQL.

## Features

### User Features
- ✅ **Anonymous Access** - No login required, tickets accessed via unique ID
- ✅ **Category Selection** - Technical, Billing, Sales, Other
- ✅ **Real-time Chat Interface** - User and admin messages styled like modern chat apps
- ✅ **Ticket Status Tracking** - Open, In Progress, Waiting Customer, Resolved, Closed
- ✅ **Auto-refresh** - Ticket page auto-refreshes every 30 seconds
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Copy Ticket ID** - Easy copy-to-clipboard functionality
- ✅ **Ticket Search** - Find tickets by unique ID

### System Features
- 🔒 Secure MySQL database
- 🎨 Modern UI with Framer Motion animations
- 📱 Mobile-responsive chat interface
- 🔄 Real-time status updates
- 🎯 Priority system (Low, Medium, High, Urgent)
- 📊 Categorized tickets
- 💬 Message history with timestamps
- ⚡ Next.js 16 App Router with Server Components
- 🎭 TypeScript for type safety

## Database Schema

### Tables
1. **tickets** - Main ticket information
2. **messages** - User and admin messages
3. **admin_notes** - Internal admin notes (not visible to users)
4. **admin_users** - Admin authentication

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

Dependencies are already added:
- `mysql2` - MySQL driver for Node.js

### 2. Database Setup

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p < lib/db-schema.sql
```

**Option B: Using MySQL Workbench or phpMyAdmin**

1. Open `lib/db-schema.sql`
2. Execute the SQL commands in your MySQL client
3. This will create:
   - Database: `uncrypto_tickets`
   - All required tables
   - Default admin user

### 3. Environment Configuration

Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=uncrypto_tickets
ADMIN_SECRET_KEY=your-random-secret-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Flow

### Creating a Ticket

1. Navigate to `/support` or `/tickets/new`
2. Select category (Technical, Billing, Sales, Other)
3. Enter subject and detailed message
4. Click "Create Ticket"
5. **Save the Ticket ID** - displayed on success screen (e.g., `TKT-XXXXXXXXX`)
6. User can immediately view the ticket or save the ID for later

### Accessing an Existing Ticket

1. Navigate to `/tickets`
2. Enter the ticket ID (e.g., `TKT-XXXXXXXXX`)
3. Click "Access Ticket"
4. View conversation history and reply

### Replying to a Ticket

1. On the ticket page, type message in the text area
2. Press Enter or click "Send"
3. Message appears in the chat interface
4. Page auto-refreshes every 30 seconds for new admin replies

## File Structure

```
app/
├── api/
│   └── tickets/
│       ├── create/
│       │   └── route.ts          # Create new ticket
│       └── [id]/
│           ├── route.ts           # Get ticket details
│           └── reply/
│               └── route.ts       # Add reply to ticket
├── tickets/
│   ├── page.tsx                   # Ticket search/access page
│   ├── new/
│   │   └── page.tsx               # Create new ticket page
│   └── [id]/
│       └── page.tsx               # Ticket conversation UI
└── support/
    └── page.tsx                   # Updated with ticket links

lib/
├── db.ts                          # MySQL connection pool
├── db-schema.sql                  # Database schema
└── ticket-utils.ts                # Utility functions

types/
└── ticket.ts                      # TypeScript type definitions
```

## API Endpoints

### POST `/api/tickets/create`
Create a new support ticket

**Request Body:**
```json
{
  "category": "technical",
  "subject": "Cannot complete swap",
  "message": "I'm having issues..."
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "TKT-XXXXXXXXX",
  "message": "Ticket created successfully"
}
```

### GET `/api/tickets/[id]`
Get ticket details and messages

**Response:**
```json
{
  "ticket": {
    "id": "TKT-XXXXXXXXX",
    "category": "technical",
    "subject": "...",
    "status": "open",
    "priority": "medium",
    "created_at": "...",
    "updated_at": "...",
    "last_reply_at": "...",
    "last_reply_by": "user"
  },
  "messages": [
    {
      "id": 1,
      "ticket_id": "TKT-XXXXXXXXX",
      "message": "...",
      "sender_type": "user",
      "admin_name": null,
      "created_at": "...",
      "is_internal": false
    }
  ]
}
```

### POST `/api/tickets/[id]/reply`
Add a reply to a ticket

**Request Body:**
```json
{
  "message": "Thank you for the update..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply added successfully"
}
```

## Ticket Statuses

- **Open** - New ticket, awaiting admin response
- **In Progress** - Admin is working on the issue
- **Waiting Customer** - Admin needs more information from user
- **Resolved** - Issue has been resolved
- **Closed** - Ticket is closed (no more replies allowed)

## Categories

- **Technical** - Issues with swaps, transactions, platform
- **Billing** - Fee questions, refunds, payments
- **Sales** - Business inquiries, partnerships
- **Other** - General questions or feedback

## Priority Levels

- **Low** - General inquiries
- **Medium** - Standard issues (default)
- **High** - Important issues affecting service
- **Urgent** - Critical problems requiring immediate attention

## Security Features

- ✅ No authentication required for users (anonymous)
- ✅ Tickets accessed only by unique ID
- ✅ SQL injection prevention (prepared statements)
- ✅ Input validation
- ✅ XSS protection
- ✅ Connection pooling for performance

## Important Notes

### For Users
- **Keep your Ticket ID safe!** It's the only way to access your ticket
- Bookmark the ticket URL for easy access
- Closed tickets cannot receive new replies
- Auto-refresh every 30 seconds while viewing ticket

### For Developers
- Ticket IDs are generated with timestamp + random string
- Messages are ordered chronologically
- Internal admin notes are hidden from users
- Database uses transactions for data integrity
- Connection pool limits concurrent connections

## Next Steps (Admin Dashboard)

To complete the system, you'll need to create an admin dashboard:

1. **Admin Login** - Authentication system for support staff
2. **Ticket List** - View all tickets with filters
3. **Ticket Management** - Change status, priority, assign tickets
4. **Admin Replies** - Respond to user messages
5. **Internal Notes** - Private notes between admin team
6. **Statistics** - Ticket metrics and analytics

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
sudo service mysql status

# Test connection
mysql -u root -p

# Check database exists
SHOW DATABASES;
USE uncrypto_tickets;
SHOW TABLES;
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Can't Find Ticket
- Verify ticket ID is correct (case-sensitive)
- Check database for ticket existence
- Ensure proper MySQL configuration in `.env.local`

## Production Deployment

Before deploying to production:

1. Change the default admin password in database
2. Set strong `ADMIN_SECRET_KEY` in environment variables
3. Enable SSL for database connections
4. Set up proper database backups
5. Configure rate limiting for API routes
6. Enable HTTPS
7. Set `NODE_ENV=production`

## License

This ticket system is part of the UnCrypto project.
