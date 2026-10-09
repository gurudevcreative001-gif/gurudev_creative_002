import { isAdminAuthenticated } from '../utils/storage';

export interface UserSession {
  user: {
    id: string;
    role: string;
    name: string;
  };
}

export async function getServerUserSession(request?: Request): Promise<UserSession> {
  // Check authorization header or admin authentication status
  const authHeader = request?.headers.get('authorization');
  const isAdmin = isAdminAuthenticated() || authHeader === 'Bearer gurudev@002';

  if (!isAdmin) {
    throw new Error('Admin login જરૂરી છે.');
  }

  return {
    user: {
      id: 'admin_001',
      role: 'admin',
      name: 'Gurudev Admin',
    },
  };
}
