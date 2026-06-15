import { adminClient } from './supabase';

type Env = Record<string, string | undefined> | undefined;

export interface AuthedUser { id: string; email: string | null; role: string; }

/**
 * Verify the Bearer token on an API request and return the user + role.
 * Returns null if missing/invalid. Uses the admin client to read the role.
 */
export async function getUserFromRequest(
  request: Request, env: Env,
): Promise<AuthedUser | null> {
  const auth = request.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;

  const supabase = adminClient(env);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', data.user.id).maybeSingle();

  return { id: data.user.id, email: data.user.email ?? null, role: profile?.role ?? 'guest' };
}
