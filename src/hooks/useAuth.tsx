
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود بيانات مصادقة محفوظة
    const savedUser = localStorage.getItem('groceryApp_user');
    const rememberMe = localStorage.getItem('groceryApp_rememberMe');
    
    if (savedUser && rememberMe === 'true') {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // محاكاة تسجيل الدخول - التحقق من البيانات المحفوظة
    const savedUsers = JSON.parse(localStorage.getItem('groceryApp_users') || '{}');
    
    if (savedUsers[username] && savedUsers[username] === password) {
      const user = { username };
      setUser(user);
      localStorage.setItem('groceryApp_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // التحقق من عدم وجود اسم المستخدم مسبقاً
    const savedUsers = JSON.parse(localStorage.getItem('groceryApp_users') || '{}');
    
    if (savedUsers[username]) {
      setIsLoading(false);
      return false; // اسم المستخدم موجود مسبقاً
    }
    
    // حفظ المستخدم الجديد
    savedUsers[username] = password;
    localStorage.setItem('groceryApp_users', JSON.stringify(savedUsers));
    
    // تسجيل الدخول تلقائياً
    const user = { username };
    setUser(user);
    localStorage.setItem('groceryApp_user', JSON.stringify(user));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('groceryApp_user');
    localStorage.removeItem('groceryApp_rememberMe');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
