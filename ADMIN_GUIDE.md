# Admin Dashboard Guide

## 🎯 Overview

The admin dashboard allows support staff to view, manage, and respond to customer support tickets.

---

## 🔐 Admin Access

### Login Credentials (Default)
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password in production!

---

## 📋 Features

### 1. **Admin Login** (`/admin/login`)
- Secure JWT-based authentication
- Session stored in HTTP-only cookie (24 hours)
- Automatic redirect on successful login

### 2. **Dashboard** (`/admin/dashboard`)
- View all support tickets
- Filter by:
  - Status (Open, In Progress, Waiting Customer, Resolved, Closed)
  - Category (Technical, Billing, Sales, Other)
- Real-time ticket count
- Click any ticket to view details
- Highlights tickets with new customer replies

### 3. **Ticket Management** (`/admin/tickets/[id]`)
- View full conversation history
- Reply to customers
- Add internal notes (hidden from customers)
- Update ticket status
- Change priority level
- Auto-refresh every 30 seconds

---

## 🚀 How to Use

### Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Enter credentials (admin / admin123)
3. Click "Login"
4. You'll be redirected to the dashboard

### Viewing Tickets

1. From the dashboard, see all tickets listed
2. Use filters to narrow down by status or category
3. Tickets with new customer replies are highlighted
4. Click any ticket to view details

### Replying to Tickets

1. Click on a ticket from the dashboard
2. Type your reply in the text area
3. **Options:**
   - Send as normal reply (customer can see)
   - Check "Internal Note" to hide from customer
4. Click "Send Reply"

### Managing Ticket Status

1. Open a ticket
2. In the left sidebar, change:
   - **Status:**
     - Open - New ticket
     - In Progress - Currently working on it
     - Waiting Customer - Need customer response
     - Resolved - Issue fixed
     - Closed - Ticket closed
   - **Priority:**
     - Low
     - Medium
     - High
     - Urgent
3. Click "Update Ticket"

---

## 📊 API Endpoints (Admin)

### Authentication
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Get All Tickets
```http
GET /api/admin/tickets?status=open&category=technical
Cookie: admin_token=...
```

### Reply to Ticket
```http
POST /api/admin/tickets/[id]/reply
Cookie: admin_token=...
Content-Type: application/json

{
  "message": "Thank you for contacting us...",
  "isInternal": false
}
```

### Update Ticket Status
```http
PATCH /api/admin/tickets/[id]/status
Cookie: admin_token=...
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "high"
}
```

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Token expires after 24 hours
- ✅ Protected API routes (require admin token)
- ✅ Secure password handling (ready for bcrypt)
- ✅ Role-based access control
- ✅ XSS protection
- ✅ CSRF protection via HTTP-only cookies

---

## 💡 Tips for Support Staff

### Best Practices

1. **Response Times**
   - Aim to respond within 2-4 hours
   - Use status updates to keep customers informed

2. **Status Management**
   - Set to "In Progress" when you start working
   - Use "Waiting Customer" when you need info
   - Mark "Resolved" when fixed (let customer confirm)
   - Only "Close" after customer confirms resolution

3. **Internal Notes**
   - Use for coordination with other admins
   - Document troubleshooting steps
   - Add context that customer doesn't need to see

4. **Priority Levels**
   - **Urgent:** Service down, critical bugs
   - **High:** Major issues affecting multiple users
   - **Medium:** Standard support requests
   - **Low:** General questions, feature requests

### Keyboard Shortcuts

- **Enter:** Send reply (while focused on text area)
- **Shift + Enter:** New line in message

---

## 🛠️ Advanced Features (Future)

Ready to implement:
- [ ] Email notifications for new tickets
- [ ] Admin user management
- [ ] Ticket assignment to specific admins
- [ ] Canned responses / templates
- [ ] Ticket analytics dashboard
- [ ] Bulk actions
- [ ] Export tickets to CSV
- [ ] File attachments
- [ ] Customer satisfaction ratings

---

## 🔐 Changing Admin Password

### Step 1: Hash New Password

Use bcrypt to hash the password:

```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('new_password', 10);
console.log(hash);
```

### Step 2: Update Database

```sql
UPDATE admin_users
SET password_hash = 'your_bcrypt_hash_here'
WHERE username = 'admin';
```

### Step 3: Update Login Code

Uncomment bcrypt verification in `/app/api/admin/login/route.ts`:

```typescript
import bcrypt from 'bcrypt';

// Replace simple check with:
const isValid = await bcrypt.compare(password, admin.password_hash);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
```

---

## 📝 Adding New Admin Users

```sql
INSERT INTO admin_users (username, password_hash, name, email, role)
VALUES (
  'new_admin',
  'bcrypt_hash_here',
  'Admin Name',
  'admin@example.com',
  'support'
);
```

**Roles:**
- `admin` - Full access
- `support` - Standard support access
- `manager` - Management access

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check if logged in
- Token may have expired (24 hours)
- Log out and log back in

### Can't See Tickets
- Check database connection
- Verify tickets exist in database
- Check browser console for errors

### Can't Send Replies
- Check if ticket is closed
- Verify message is not empty
- Check network tab for API errors

---

## 🎨 Customization

### Branding
- Logo: Update logo in `/admin/login/page.tsx`
- Colors: Modify Tailwind classes throughout admin pages
- Company name: Change "UnCrypto Admin" text

### Auto-Refresh Interval
Change in `/admin/tickets/[id]/page.tsx`:
```typescript
const interval = setInterval(fetchTicket, 30000); // 30 seconds
```

---

## 📞 Support for Support Staff

If you encounter issues with the admin panel:
1. Check browser console for errors
2. Verify database connection
3. Check API routes are working (`/api/health`)
4. Review server logs

**Technical Contact:** Your development team

---

**Admin Dashboard Version:** 1.0.0
**Last Updated:** November 1, 2025
