// src/services/authService.js

// Mock user data
const mockUsers = {
  admin: {
    id: 'admin_001',
    name: 'System Administrator',
    email: 'admin@university.edu',
    role: 'admin',
    avatar: null,
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_courses'],
  },
  student: {
    id: 'student_123',
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    role: 'student',
    avatar: null,
    studentId: 'STU2024001',
    program: 'Computer Science',
    year: 2,
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login function
  async login(role) {
    await delay(1000); // Simulate API call delay
    
    if (!['admin', 'student'].includes(role)) {
      throw new Error('Invalid role specified');
    }

    const user = mockUsers[role];
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate successful authentication
    return {
      user: user,
      role: user.role,
      token: `mock_token_${role}_${Date.now()}`, // Mock JWT token
    };
  },

  // Logout function
  async logout() {
    await delay(500);
    return { success: true };
  },

  // Verify token (for persistent sessions)
  async verifyToken(token) {
    await delay(200);
    
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Invalid token');
    }
    
    const role = token.includes('admin') ? 'admin' : 'student';
    const user = mockUsers[role];
    
    return {
      user: user,
      role: user.role,
      token: token,
    };
  },

  // Register function (for future implementation)
  async register(userData) {
    await delay(1500);
    
    // Basic validation
    if (!userData.email || !userData.name || !userData.role) {
      throw new Error('Missing required fields');
    }
    
    // Simulate user creation
    const newUser = {
      id: `${userData.role}_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    return {
      user: newUser,
      role: newUser.role,
      token: `mock_token_${newUser.role}_${Date.now()}`,
    };
  },

  // Get current user profile
  async getProfile() {
    await delay(300);
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.verifyToken(token);
  },

  // Update user profile
  async updateProfile(userId, updates) {
    await delay(800);
    
    // In a real app, this would update the user in the database
    const currentAuth = JSON.parse(localStorage.getItem('auth') || '{}');
    const updatedUser = { ...currentAuth.user, ...updates };
    
    // Update localStorage
    localStorage.setItem('auth', JSON.stringify({
      ...currentAuth,
      user: updatedUser,
    }));
    
    return {
      user: updatedUser,
      role: updatedUser.role,
    };
  },

  // Change password (mock implementation)
  async changePassword(currentPassword, newPassword) {
    await delay(1000);
    
    if (!currentPassword || !newPassword) {
      throw new Error('Both current and new passwords are required');
    }
    
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }
    
    // In a real app, you would verify the current password and hash the new one
    return { success: true, message: 'Password updated successfully' };
  },

  // Request password reset (mock implementation)
  async requestPasswordReset(email) {
    await delay(1500);
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    // Simulate sending reset email
    return { 
      success: true, 
      message: 'Password reset link sent to your email' 
    };
  },
};