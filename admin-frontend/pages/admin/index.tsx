import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

export default function AdminIndex() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h1>Super Admin Dashboard</h1>
        <p>Welcome to the Super Admin control center. Use the left sidebar to manage pages and services.</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/admin/pages">Manage Pages</Link>
        </div>
      </main>
    </div>
  );
}


