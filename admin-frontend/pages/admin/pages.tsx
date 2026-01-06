import { useEffect, useState } from 'react';

type Page = {
  id: string;
  slug: string;
  title: string;
};

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => setPages([]));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Pages</h2>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>
            {p.title} — {p.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}


