import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: 260, borderRight: '1px solid #e5e7eb', padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 16 }}>Super Admin</div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <Link href="/admin">Dashboard</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/admin/pages">Main Landing</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/admin/food">Food Service</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/admin/person">Person Service</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/admin/parcel">Parcel Service</Link>
          </li>
          <li style={{ marginTop: 12 }}>
            <Link href="/admin/media">Media Manager</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}


