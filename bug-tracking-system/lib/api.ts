// Dummy data for demonstration
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "admin@demo.com",
    role: "Admin",
    status: "Active",
    username: "admin"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "dev@demo.com",
    role: "Developer",
    status: "Active",
    username: "sarah"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@demo.com",
    role: "Developer",
    status: "Active",
    username: "mike"
  },
  {
    id: 4,
    name: "Jane Smith",
    email: "reporter@demo.com",
    role: "Reporter",
    status: "Active",
    username: "jane"
  }
];

const dummyBugs = [
  {
    id: 1,
    title: "Login button not working on mobile",
    description: "Users can't login on mobile devices, button appears disabled.",
    priority: "High",
    status: "Open",
    module: "Authentication",
    reporter: "Jane Smith",
    assignedTo: null,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    userId: 4,
    stepsToReproduce: "1. Open app on mobile\n2. Navigate to login\n3. Enter credentials\n4. Tap login button",
    expectedBehavior: "User should be logged in",
    actualBehavior: "Button appears disabled",
    screenshots: ["/placeholder.svg?height=200&width=300&text=Mobile+Login+Screenshot"]
  },
  {
    id: 2,
    title: "Dashboard not loading properly",
    description: "Dashboard shows blank screen after login on Chrome browser.",
    priority: "Medium",
    status: "In Progress",
    module: "Dashboard",
    reporter: "Jane Smith",
    assignedTo: "Sarah Wilson",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
    userId: 4,
    assignedToId: 2,
    stepsToReproduce: "1. Login to system\n2. Navigate to dashboard\n3. See blank screen",
    expectedBehavior: "Dashboard should load with data",
    actualBehavior: "Blank white screen",
    screenshots: ["/placeholder.svg?height=200&width=300&text=Dashboard+Error"]
  },
  {
    id: 3,
    title: "Export PDF not working",
    description: "PDF export button generates corrupted files.",
    priority: "Low",
    status: "Resolved",
    module: "Reports",
    reporter: "Jane Smith",
    assignedTo: "Mike Johnson",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    userId: 4,
    assignedToId: 3,
    stepsToReproduce: "1. Go to reports page\n2. Click export PDF\n3. Download file",
    expectedBehavior: "Valid PDF file",
    actualBehavior: "Corrupted file",
    screenshots: ["/placeholder.svg?height=200&width=300&text=PDF+Error"]
  }
];

const dummyComments = [
  {
    id: 1,
    bugId: 1,
    user: { name: "Sarah Wilson", role: "Developer" },
    text: "I've reproduced this issue on iOS Safari. Working on a fix.",
    createdAt: "2024-01-16T09:15:00Z"
  },
  {
    id: 2,
    bugId: 1,
    user: { name: "Jane Smith", role: "Reporter" },
    text: "Thanks for looking into this! It also happens on Android Chrome as well.",
    createdAt: "2024-01-16T11:30:00Z"
  },
  {
    id: 3,
    bugId: 2,
    user: { name: "Sarah Wilson", role: "Developer" },
    text: "Found the issue - it's a JavaScript error in the dashboard component.",
    createdAt: "2024-01-17T10:20:00Z"
  }
];

// Helper function to get current user from localStorage
function getCurrentUserFromStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Helper function to filter bugs based on user role
function filterBugsByRole(bugs: any[], user: any) {
  if (!user) return [];
  
  switch (user.role) {
    case 'Admin':
      return bugs; // Admin sees all bugs
    case 'Developer':
      return bugs.filter(bug => 
        bug.assignedToId === user.id || 
        bug.userId === user.id || 
        bug.status === 'Open'
      );
    case 'Reporter':
      return bugs.filter(bug => bug.userId === user.id);
    default:
      return [];
  }
}

// --- Authentication Functions ---
export function login(email: string, password: string) {
  // Simulate API delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = dummyUsers.find(u => u.email === email);
      if (!user || password !== 'password') {
        reject(new Error('Invalid credentials'));
        return;
      }
      
      const token = 'dummy-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      resolve({ user, token });
    }, 500);
  });
}

export function register(userData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      if (dummyUsers.find(u => u.email === userData.email)) {
        reject(new Error('User already exists'));
        return;
      }
      
      const newUser = {
        id: dummyUsers.length + 1,
        ...userData,
        status: 'Active'
      };
      
      dummyUsers.push(newUser);
      
      const token = 'dummy-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      resolve({ user: newUser, token });
    }, 500);
  });
}

export function getCurrentUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getCurrentUserFromStorage());
    }, 200);
  });
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// --- Bug Functions ---
export function fetchBugs(params?: Record<string, any>) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      let filteredBugs = filterBugsByRole(dummyBugs, user);
      
      // Apply filters
      if (params?.status && params.status !== 'all') {
        filteredBugs = filteredBugs.filter(bug => bug.status === params.status);
      }
      if (params?.priority && params.priority !== 'all') {
        filteredBugs = filteredBugs.filter(bug => bug.priority === params.priority);
      }
      if (params?.module && params.module !== 'all') {
        filteredBugs = filteredBugs.filter(bug => bug.module === params.module);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredBugs = filteredBugs.filter(bug => 
          bug.title.toLowerCase().includes(search) ||
          bug.description.toLowerCase().includes(search)
        );
      }
      
      resolve(filteredBugs);
    }, 300);
  });
}

export function fetchBug(id: string | number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const bug = dummyBugs.find(b => b.id === parseInt(id.toString()));
      
      if (!bug) {
        reject(new Error('Bug not found'));
        return;
      }
      
      // Check permissions
      if (user.role === 'Reporter' && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      if (user.role === 'Developer' && bug.assignedToId !== user.id && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      
      // Add comments to bug
      const bugComments = dummyComments.filter(c => c.bugId === bug.id);
      resolve({ ...bug, comments: bugComments });
    }, 200);
  });
}

export function createBug(data: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const newBug = {
        id: dummyBugs.length + 1,
        ...data,
        status: 'Open',
        reporter: user.name,
        assignedTo: null,
        assignedToId: null,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        screenshots: []
      };
      
      dummyBugs.push(newBug);
      
      // Simulate email notification to admin
      console.log(`Email sent to admin: New bug reported by ${user.name}`);
      
      resolve(newBug);
    }, 500);
  });
}

export function updateBug(id: string | number, data: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const bugIndex = dummyBugs.findIndex(b => b.id === parseInt(id.toString()));
      
      if (bugIndex === -1) {
        reject(new Error('Bug not found'));
        return;
      }
      
      const bug = dummyBugs[bugIndex];
      
      // Check permissions
      if (user.role === 'Reporter' && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      if (user.role === 'Developer' && bug.assignedToId !== user.id && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      
      // Update bug
      const updatedBug = { ...bug, ...data, updatedAt: new Date().toISOString() };
      dummyBugs[bugIndex] = updatedBug;
      
      // Simulate email notifications
      if (data.status && data.status !== bug.status) {
        console.log(`Email sent to ${bug.reporter}: Bug status updated to ${data.status}`);
      }
      if (data.assignedTo && data.assignedTo !== bug.assignedTo) {
        console.log(`Email sent to ${data.assignedTo}: Bug assigned to you`);
      }
      
      resolve(updatedBug);
    }, 300);
  });
}

export function deleteBug(id: string | number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const bugIndex = dummyBugs.findIndex(b => b.id === parseInt(id.toString()));
      
      if (bugIndex === -1) {
        reject(new Error('Bug not found'));
        return;
      }
      
      const bug = dummyBugs[bugIndex];
      
      // Only Admin can delete bugs
      if (user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      dummyBugs.splice(bugIndex, 1);
      resolve({ message: 'Bug deleted successfully' });
    }, 300);
  });
}

export function fetchBugStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      let filteredBugs = filterBugsByRole(dummyBugs, user);
      
      resolve({
        totalBugs: filteredBugs.length,
        openBugs: filteredBugs.filter(bug => bug.status === 'Open').length,
        inProgress: filteredBugs.filter(bug => bug.status === 'In Progress').length,
        resolved: filteredBugs.filter(bug => bug.status === 'Resolved').length
      });
    }, 200);
  });
}

// --- User Functions ---
export function fetchUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      if (user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      resolve(dummyUsers.map(u => ({
        ...u,
        bugsReported: dummyBugs.filter(b => b.userId === u.id).length,
        bugsAssigned: dummyBugs.filter(b => b.assignedToId === u.id).length
      })));
    }, 300);
  });
}

export function fetchUser(id: string | number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      if (user.id !== parseInt(id.toString()) && user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      const foundUser = dummyUsers.find(u => u.id === parseInt(id.toString()));
      if (!foundUser) {
        reject(new Error('User not found'));
        return;
      }
      
      resolve(foundUser);
    }, 200);
  });
}

export function createUser(data: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      if (user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      const newUser = {
        id: dummyUsers.length + 1,
        ...data,
        status: 'Active'
      };
      
      dummyUsers.push(newUser);
      resolve(newUser);
    }, 500);
  });
}

export function updateUser(id: string | number, data: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      if (user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      const userIndex = dummyUsers.findIndex(u => u.id === parseInt(id.toString()));
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      const updatedUser = { ...dummyUsers[userIndex], ...data };
      dummyUsers[userIndex] = updatedUser;
      
      resolve(updatedUser);
    }, 300);
  });
}

export function deleteUser(id: string | number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      if (user.role !== 'Admin') {
        reject(new Error('Access denied'));
        return;
      }
      
      const userIndex = dummyUsers.findIndex(u => u.id === parseInt(id.toString()));
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      dummyUsers.splice(userIndex, 1);
      resolve({ message: 'User deleted successfully' });
    }, 300);
  });
}

// --- Comment Functions ---
export function addComment(bugId: number, text: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const newComment = {
        id: dummyComments.length + 1,
        bugId,
        user: { name: user.name, role: user.role },
        text,
        createdAt: new Date().toISOString()
      };
      
      dummyComments.push(newComment);
      
      // Simulate email notification
      const bug = dummyBugs.find(b => b.id === bugId);
      if (bug && bug.reporter !== user.name) {
        console.log(`Email sent to ${bug.reporter}: New comment added to bug #${bugId}`);
      }
      
      resolve(newComment);
    }, 300);
  });
}

// --- Export Functions ---
export function exportBugAsPDF(bugId: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUserFromStorage();
      const bug = dummyBugs.find(b => b.id === bugId);
      
      if (!bug) {
        reject(new Error('Bug not found'));
        return;
      }
      
      // Check permissions
      if (user.role === 'Reporter' && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      if (user.role === 'Developer' && bug.assignedToId !== user.id && bug.userId !== user.id) {
        reject(new Error('Access denied'));
        return;
      }
      
      // Simulate PDF generation
      console.log(`Generating PDF for bug #${bugId}`);
      
      // Create a dummy download link
      const blob = new Blob([`Bug Report #${bugId}\n\nTitle: ${bug.title}\nDescription: ${bug.description}\nStatus: ${bug.status}\nPriority: ${bug.priority}\nReporter: ${bug.reporter}\nAssigned To: ${bug.assignedTo || 'Unassigned'}\nCreated: ${bug.createdAt}`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bug-report-${bugId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      resolve({ message: 'PDF exported successfully' });
    }, 1000);
  });
} 