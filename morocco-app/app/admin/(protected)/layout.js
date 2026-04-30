import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import AdminShell from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

export default function ProtectedAdminLayout({ children }) {
  const admin = getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
