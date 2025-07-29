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
  if (typeof window === 'undefined') return null;
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
  return new Promise((resolve, reject) => {
    const user = dummyUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      reject(new Error('Invalid credentials'));
      return;
    }
    
    const token = 'dummy-token-' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    resolve({ user, token });
  });
}

export function register(userData: any) {
  return new Promise((resolve, reject) => {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    resolve({ user: newUser, token });
  });
}

export function getCurrentUser() {
  return new Promise((resolve) => {
    resolve(getCurrentUserFromStorage());
  });
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// --- Bug Functions ---
export function fetchBugs(params?: Record<string, any>) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = getCurrentUserFromStorage();
      const token = getToken();
      
      if (!user || !token) {
        reject(new Error('User not authenticated'));
        return;
      }

      // Use different API endpoints based on user role
      let apiUrl;
      if (user.role === 'Admin') {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/allbugs`;
      } else {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/mybugs`;
      }
      console.log('Fetching bugs from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bugs');
      }

      const responseData = await response.json();
      
      // Extract bugs from the data property
      const bugsData = responseData.data || responseData;

      // Apply client-side filters if needed
      let filteredBugs = bugsData;
      
      if (params?.priority && params.priority !== 'all') {
        filteredBugs = filteredBugs.filter((bug: any) => bug.priority === params.priority);
      }
      if (params?.module && params.module !== 'all') {
        filteredBugs = filteredBugs.filter((bug: any) => bug.module === params.module);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredBugs = filteredBugs.filter((bug: any) => 
          bug.title.toLowerCase().includes(search) ||
          bug.description.toLowerCase().includes(search)
        );
      }
      
      resolve(filteredBugs);
    } catch (error: any) {
      reject(new Error(error.message || 'Failed to fetch bugs'));
    }
  });
}

export function fetchBug(id: string | number) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = getCurrentUserFromStorage();
      const token = getToken();
      
      if (!user || !token) {
        reject(new Error('User not authenticated'));
        return;
      }

      // Use different API endpoints based on user role
      let apiUrl;
      if (user.role === 'Admin') {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/allbugs`;
      } else {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/mybugs`;
      }
      console.log('Fetching bug from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bug');
      }

      const responseData = await response.json();
      
      // Extract bugs from the data property
      const bugsData = responseData.data || responseData;
      
      // Find the specific bug by ID
      const bugData = bugsData.find((bug: any) => bug.id === parseInt(id.toString()));
      
      if (!bugData) {
        reject(new Error('Bug not found'));
        return;
      }
      
      // Add comments if they exist in the response
      const bugWithComments = {
        ...bugData,
        comments: bugData.comments || []
      };
      
      resolve(bugWithComments);
    } catch (error: any) {
      reject(new Error(error.message || 'Failed to fetch bug'));
    }
  });
}

export function createBug(data: any, screenshots?: File[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = getCurrentUserFromStorage();
      const token = getToken();
      
      if (!user || !token) {
        reject(new Error('User not authenticated'));
        return;
      }

      // Check if user can create bugs (only Reporter role)
      if (user.role !== 'Reporter') {
        reject(new Error('Only Reporter role can create bug reports'));
        return;
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', data.title);
      formData.append('module', data.module);
      formData.append('priority', data.priority);
      formData.append('description', data.description);
      formData.append('steps', data.stepsToReproduce);
      formData.append('expected_behavior', data.expectedBehavior);
      formData.append('actual_behavior', data.actualBehavior);
      
      // Add screenshots if any
      if (screenshots && screenshots.length > 0) {
        screenshots.forEach((file, index) => {
          formData.append('screenshot', file);
        });
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/createBug`;


      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bug');
      }

      const newBug = await response.json();
      
      // Add to dummy data for consistency
      const bugWithMetadata = {
        ...newBug,
        status: 'Open',
        reporter: user.name,
        assignedTo: null,
        assignedToId: null,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dummyBugs.push(bugWithMetadata);
      
      resolve(bugWithMetadata);
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        reject(new Error('Network error: Unable to connect to API server. Please check if the server is running.'));
      } else {
        reject(new Error(error.message || 'Failed to create bug'));
      }
    }
  });
}

export function updateBug(id: string | number, data: any) {
  return new Promise((resolve, reject) => {
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
  });
}

export function deleteBug(id: string | number) {
  return new Promise((resolve, reject) => {
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
  });
}

export function fetchBugStats() {
  return new Promise((resolve) => {
    const user = getCurrentUserFromStorage();
    let filteredBugs = filterBugsByRole(dummyBugs, user);
    
    resolve({
      totalBugs: filteredBugs.length,
      openBugs: filteredBugs.filter(bug => bug.status === 'Open').length,
      inProgress: filteredBugs.filter(bug => bug.status === 'In Progress').length,
      resolved: filteredBugs.filter(bug => bug.status === 'Resolved').length
    });
  });
}

// --- User Functions ---
export function fetchUsers() {
  return new Promise((resolve, reject) => {
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
  });
}

export function fetchUser(id: string | number) {
  return new Promise((resolve, reject) => {
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
  });
}

export function createUser(data: any) {
  return new Promise((resolve, reject) => {
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
  });
}

export function updateUser(id: string | number, data: any) {
  return new Promise((resolve, reject) => {
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
  });
}

export function deleteUser(id: string | number) {
  return new Promise((resolve, reject) => {
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
  });
}

// --- Comment Functions ---
export function addComment(bugId: number, text: string) {
  return new Promise((resolve) => {
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
  });
}

// --- Export Functions ---
export function fetchDevelopers() {
  return new Promise(async (resolve, reject) => {
    try {
      const user = getCurrentUserFromStorage();
      const token = getToken();
      
      if (!user || !token) {
        reject(new Error('User not authenticated'));
        return;
      }

      // Use real API for fetching developers
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/developers`;
      console.log('Fetching developers from:', apiUrl);

      console.log('Token being sent:', token);
      console.log('Token length:', token?.length);
      console.log('User making request:', user);
      console.log('User role:', user?.role);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('Developers API response status:', response.status);
      console.log('Developers API response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch developers');
      }

      // Handle 304 Not Modified (cached response)
      if (response.status === 304) {
        console.log('Developers API returned 304 - using cached data');
        // For 304, we might need to handle this differently
        // Let's try to get the data anyway
      }

      let developersData;
      try {
        // First, let's see what the raw response looks like
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!responseText) {
          console.log('Empty response text - might be 304 cached response');
          resolve([]);
          return;
        }
        
        developersData = JSON.parse(responseText);
        console.log('Developers fetched:', developersData);
        console.log('Developers data type:', typeof developersData);
        console.log('Is developersData an array?', Array.isArray(developersData));
      } catch (error) {
        console.error('Error parsing developers response:', error);
        console.log('Response text was:', responseText);
        throw new Error('Failed to parse developers response');
      }
      
      // Extract developers from the developers property
      const developers = developersData.developers || developersData.data || developersData;
      console.log('Processed developers:', developers);
      console.log('Processed developers type:', typeof developers);
      console.log('Is processed developers an array?', Array.isArray(developers));
      
      resolve(developers);
    } catch (error: any) {
      reject(new Error(error.message || 'Failed to fetch developers'));
    }
  });
}

export function updateBugAssignment(bugId: string | number, assignedTo: number | null) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = getCurrentUserFromStorage();
      const token = getToken();
      
      if (!user || !token) {
        reject(new Error('User not authenticated'));
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/bugs/${bugId}/assign/${assignedTo || 'unassigned'}`;
      console.log('Updating bug assignment:', { bugId, assignedTo, apiUrl });

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Update assignment response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bug assignment');
      }

      const result = await response.json();
      console.log('Update assignment result:', result);
      
      resolve(result);
    } catch (error: any) {
      reject(new Error(error.message || 'Failed to update bug assignment'));
    }
  });
}

export function exportBugAsPDF(bugId: number) {
  return new Promise((resolve, reject) => {
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
  });
} 