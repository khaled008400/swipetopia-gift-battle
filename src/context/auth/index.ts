
// Simplified auth context - authentication disabled temporarily
export const useAuth = () => ({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
