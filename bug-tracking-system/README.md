# BugTracker Pro - Complete Role-Based Bug Tracking System

A modern, responsive React frontend for the Bug Reporting & Feedback System built with Next.js 14, TypeScript, and Tailwind CSS. This system implements comprehensive role-based permissions with dummy data for demonstration.

## 🚀 Features

### ✅ **Reporter Role**
- ✅ **Can register and log in** - Full registration and login system
- ✅ **Can submit bugs** - Comprehensive bug reporting form with file uploads
- ✅ **Can upload screenshots** - File upload functionality for images
- ✅ **Can view only their own bugs** - Role-based filtering implemented
- ✅ **Can edit bug details (before assigned)** - Edit permissions for unassigned bugs
- ✅ **Can comment on their own bugs** - Full commenting system
- ✅ **Gets email when:**
  - ✅ **Bug status is updated** - Simulated email notifications
  - ✅ **A comment is added** - Simulated email notifications

### ✅ **Developer Role**
- ✅ **Can log in** - Full authentication system
- ✅ **Can view only bugs assigned to them** - Role-based filtering implemented
- ✅ **Can update bug status (Open -> In Progress -> Resolved)** - Status management
- ✅ **Can comment on bugs assigned to them** - Commenting system
- ✅ **Gets email when:**
  - ✅ **Bug is assigned to them** - Simulated email notifications
  - ✅ **Reporter comments** - Simulated email notifications

### ✅ **Admin Role**
- ✅ **Full access to all bugs and users** - Complete system access
- ✅ **Can assign developers to bugs** - Developer assignment functionality
- ✅ **Can delete any bug** - Bug deletion with proper permissions
- ✅ **Can update bug status** - Full status management
- ✅ **Can view all comments** - Complete comment visibility
- ✅ **Can comment on any bug** - Full commenting permissions
- ✅ **Gets email when a new bug is reported** - Simulated email notifications
- ✅ **Can export bug report as PDF** - PDF export functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React useState/useEffect
- **Data**: Dummy data with simulated API calls

## 📁 Project Structure

```
/app
├── page.tsx                 # Dashboard (Home)
├── login/page.tsx          # Login page
├── register/page.tsx       # Registration page
├── bugs/
│   ├── page.tsx           # Bug listing (role-based)
│   ├── new/page.tsx       # Create new bug
│   └── [id]/page.tsx      # Bug details (role-based)
├── users/page.tsx          # User management (Admin only)
├── profile/page.tsx        # User profile
/lib
├── api.ts                 # Dummy API with role-based logic
```

## 🎯 Role-Based Features Implementation

### **Reporter Role**
- **Dashboard**: Shows only their reported bugs
- **Bug Creation**: Full bug reporting with file uploads
- **Bug Viewing**: Can only see their own bugs
- **Bug Editing**: Can edit bugs before they're assigned
- **Comments**: Can comment on their own bugs
- **Notifications**: Simulated email notifications for status changes and comments

### **Developer Role**
- **Dashboard**: Shows assigned bugs and open bugs
- **Bug Viewing**: Can see bugs assigned to them and open bugs
- **Status Updates**: Can update bug status through workflow
- **Comments**: Can comment on assigned bugs
- **Notifications**: Simulated email notifications for assignments and comments

### **Admin Role**
- **Dashboard**: Full system overview with all bugs
- **User Management**: Complete user CRUD operations
- **Bug Management**: Full access to all bugs
- **Developer Assignment**: Can assign developers to bugs
- **Bug Deletion**: Can delete any bug
- **PDF Export**: Can export bug reports as PDF
- **Notifications**: Simulated email notifications for new bugs

## 🔐 Authentication & Demo Credentials

### Demo Users
```
Admin: admin@demo.com / password
Developer: dev@demo.com / password  
Reporter: reporter@demo.com / password
```

### Registration
- New users can register as Reporter or Developer
- Admin users must be created by existing admins
- Email validation and password confirmation

## 📊 Dummy Data

The system includes comprehensive dummy data:

### Users
- Admin users with full system access
- Developer users with assignment capabilities
- Reporter users with bug reporting permissions

### Bugs
- Various bug statuses (Open, In Progress, Resolved, Closed)
- Different priorities (Low, Medium, High, Critical)
- Multiple modules (Authentication, Dashboard, Reports, etc.)
- Assigned and unassigned bugs
- Screenshots and detailed descriptions

### Comments
- Role-based comments on bugs
- Timestamp tracking
- User attribution

## 🔄 Email Notifications (Simulated)

The system simulates email notifications for:
- New bug reports (Admin notification)
- Bug status updates (Reporter notification)
- Bug assignments (Developer notification)
- New comments (Relevant user notifications)

## 📄 PDF Export

- Admin can export any bug as PDF
- Developers can export assigned bugs
- Reporters can export their own bugs
- PDF includes all bug details and comments

## 🎨 UI/UX Features

### Modern Design
- Clean, professional interface
- Responsive design for all devices
- Dark/light mode support
- Loading states and error handling

### Role-Based UI
- Different navigation based on role
- Conditional buttons and actions
- Role-specific dashboards
- Permission-based access control

### Interactive Elements
- Real-time filtering and search
- Drag-and-drop file uploads
- Inline editing capabilities
- Confirmation dialogs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bug-tracking-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. **Access the application**: http://localhost:3000
2. **Login with demo credentials** (see above)
3. **Test different roles** by logging in with different accounts
4. **Explore role-based features**:
   - Reporter: Create bugs, view own bugs, comment
   - Developer: View assigned bugs, update status, comment
   - Admin: Full system access, user management, assignments

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### Customization
- Modify dummy data in `/lib/api.ts`
- Update role permissions in API functions
- Customize UI components in `/components/ui/`
- Add new features following existing patterns

## 🧪 Testing Different Roles

### Reporter Testing
1. Login as `reporter@demo.com`
2. Create new bug reports
3. View only your own bugs
4. Edit unassigned bugs
5. Add comments to your bugs

### Developer Testing
1. Login as `dev@demo.com`
2. View assigned bugs
3. Update bug status
4. Add comments to assigned bugs
5. Export bug reports

### Admin Testing
1. Login as `admin@demo.com`
2. View all bugs and users
3. Assign developers to bugs
4. Manage user roles
5. Delete bugs
6. Export PDF reports

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time notifications with WebSockets
- [ ] Advanced search with Elasticsearch
- [ ] Bulk operations for admins
- [ ] Custom fields and workflows
- [ ] Integration with GitHub/Jira
- [ ] Mobile app (React Native)
- [ ] Dark mode theme

### Performance Optimizations
- [ ] Image optimization and compression
- [ ] Code splitting and lazy loading
- [ ] Caching strategies
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo credentials for testing

---

**Note**: This is a demonstration system with dummy data. In production, you would:
- Connect to a real backend API
- Implement proper authentication
- Add real email notifications
- Set up proper file storage
- Add comprehensive error handling
- Implement proper security measures
