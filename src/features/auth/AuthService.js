export default {
  login: async ({ username }) => {
    await new Promise(r => setTimeout(r, 700)); // simulate API delay
    return { token: 'dummy-token', username };
  },

  // Simple mock register method - returns a token and the passed username
  register: async ({ username, password }) => {

    await new Promise(r => setTimeout(r, 700)); // simulate API delay
    // In a real app, you'd make an API call here, validate, etc.
    
    return { token: 'dummy-token', username };
  }
};
