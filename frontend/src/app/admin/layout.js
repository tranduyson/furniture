import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: "SONTD Admin – Quản trị hệ thống",
};

export default function AdminRootLayout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
