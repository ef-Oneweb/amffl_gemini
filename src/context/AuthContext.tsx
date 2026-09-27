import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AdminRole } from '../types';
import { StorageService } from '../services/storageService';
import { DEMO_USERS } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  role: UserRole | null;
  adminRole: AdminRole;
  switchAdminRole: (role: AdminRole) => void;
  canPerform: (permission: string) => boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, fullName: string, phone?: string) => Promise<{ success: boolean; requiresOtp?: boolean }>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string | null) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [pendingRegisterUser, setPendingRegisterUser] = useState<User | null>(null);

  useEffect(() => {
    const currentId = StorageService.getCurrentUserId();
    if (currentId) {
      const found = StorageService.getUserById(currentId);
      if (found) {
        setUser(found);
      } else {
        // default to emeka (verified seller)
        const def = DEMO_USERS[1];
        setUser(def);
        StorageService.setCurrentUserId(def.id);
      }
    }
    setIsLoadingAuth(false);

    const handleUpdate = () => {
      const updatedId = StorageService.getCurrentUserId();
      if (updatedId) {
        const u = StorageService.getUserById(updatedId);
        setUser(u || null);
      } else {
        setUser(null);
      }
    };

    window.addEventListener('amffl_store_update', handleUpdate);
    return () => window.removeEventListener('amffl_store_update', handleUpdate);
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    // Search user by email in storage
    const users = StorageService.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      // Auto-create user for frictionless test login
      const newUser: User = {
        id: `user_${Date.now()}`,
        created_date: new Date().toISOString(),
        full_name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        is_verified: false,
        tier_badge: 'Standard',
        member_since: 'Just now',
      };
      StorageService.saveUser(newUser);
      found = newUser;
    }

    StorageService.setCurrentUserId(found.id);
    setUser(found);
    setIsLoadingAuth(false);
    return true;
  };

  const register = async (
    email: string,
    _pass: string,
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; requiresOtp?: boolean }> => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      created_date: new Date().toISOString(),
      full_name: fullName,
      email: email,
      phone: phone || '+234 800 000 0000',
      role: 'user',
      is_verified: false,
      tier_badge: 'Standard',
      member_since: 'New Member',
    };
    setPendingRegisterUser(newUser);
    return { success: true, requiresOtp: true };
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (otp === '123456' || otp.length === 6) {
      if (pendingRegisterUser) {
        StorageService.saveUser(pendingRegisterUser);
        StorageService.setCurrentUserId(pendingRegisterUser.id);
        setUser(pendingRegisterUser);
        setPendingRegisterUser(null);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('amffl_current_user_id');
    setUser(null);
  };

  const switchDemoUser = (userId: string | null) => {
    if (!userId) {
      logout();
      return;
    }
    const target = StorageService.getUserById(userId);
    if (target) {
      StorageService.setCurrentUserId(target.id);
      setUser(target);
    }
  };

  const [adminRole, setAdminRoleState] = useState<AdminRole>(() => StorageService.getActiveAdminRole());

  const switchAdminRole = (newRole: AdminRole) => {
    StorageService.setActiveAdminRole(newRole);
    setAdminRoleState(newRole);
  };

  const canPerform = (permission: string): boolean => {
    if (user?.role !== 'admin') return false;
    return StorageService.canPerformPermission(adminRole, permission);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    StorageService.saveUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        role: user ? user.role : null,
        adminRole,
        switchAdminRole,
        canPerform,
        login,
        register,
        verifyOtp,
        logout,
        switchDemoUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
