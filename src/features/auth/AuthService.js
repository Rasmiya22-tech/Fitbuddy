// Simple in-memory storage for registered users (username -> password)
// In a real app, this would be a backend database
const registeredUsers = {};

export default {
  login: async ({ username, password }) => {
    await new Promise(r => setTimeout(r, 700)); // simulate API delay
    
    // Check if user exists and password matches
    if (!registeredUsers[username]) {
      throw new Error('Username not found. Please create an account first.');
    }
    
    if (registeredUsers[username] !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    
    return { token: 'dummy-token-' + Date.now(), username };
  },

  // Register method - stores credentials and returns a token
  register: async ({ username, password }) => {
    await new Promise(r => setTimeout(r, 700)); // simulate API delay
    
    // Check if username already exists
    if (registeredUsers[username]) {
      throw new Error('Username already exists. Please choose a different one.');
    }
    
    // Store the credentials
    registeredUsers[username] = password;
    
    return { token: 'dummy-token-' + Date.now(), username };
  }
};
