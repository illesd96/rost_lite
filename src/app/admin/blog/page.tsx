'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ArrowLeft,
  FileText,
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  month: string | null;
  monthLabel: string | null;
  readingTime: string | null;
  published: boolean;
  publishedAt: string | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}

const MONTH_OPTIONS = [
  { value: '', label: '-- Nincs --' },
  { value: 'jan', label: 'Január', monthLabel: 'január' },
  { value: 'feb', label: 'Február', monthLabel: 'február' },
  { value: 'mar', label: 'Március', monthLabel: 'március' },
  { value: 'apr', label: 'Április', monthLabel: 'április' },
  { value: 'may', label: 'Május', monthLabel: 'május' },
  { value: 'jun', label: 'Június', monthLabel: 'június' },
  { value: 'jul', label: 'Július', monthLabel: 'július' },
  { value: 'aug', label: 'Augusztus', monthLabel: 'augusztus' },
  { value: 'sep', label: 'Szeptember', monthLabel: 'szeptember' },
  { value: 'oct', label: 'Október', monthLabel: 'október' },
  { value: 'nov', label: 'November', monthLabel: 'november' },
  { value: 'dec', label: 'December', monthLabel: 'december' },
];

const emptyPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  month: '',
  monthLabel: '',
  readingTime: '',
  published: false,
  authorName: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<typeof emptyPost | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/api/blog/posts?admin=true');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNew = () => {
    setEditingId(null);
    setEditingPost({ ...emptyPost });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setEditingPost({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      month: post.month || '',
      monthLabel: post.monthLabel || '',
      readingTime: post.readingTime || '',
      published: post.published,
      authorName: post.authorName || '',
    });
  };

  const handleSave = async () => {
    if (!editingPost) return;
    setSaving(true);

    const payload = {
      ...editingPost,
      slug: editingPost.slug || generateSlug(editingPost.title),
    };

    if (editingId) {
      await fetch(`/api/blog/posts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    setEditingPost(null);
    setEditingId(null);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchPosts();
  };

  const handleTogglePublish = async (post: BlogPost) => {
    await fetch(`/api/blog/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...post,
        published: !post.published,
      }),
    });
    fetchPosts();
  };

  // Editor view
  if (editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setEditingPost(null); setEditingId(null); }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft size={20} />
            Vissza
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {editingId ? 'Bejegyzés szerkesztése' : 'Új bejegyzés'}
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cím *</label>
            <input
              type="text"
              value={editingPost.title}
              onChange={e => {
                const title = e.target.value;
                setEditingPost(prev => prev ? {
                  ...prev,
                  title,
                  slug: prev.slug || generateSlug(title),
                } : null);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Bejegyzés címe"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={editingPost.slug}
              onChange={e => setEditingPost(prev => prev ? { ...prev, slug: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="bejegyzes-url-neve"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kivonat (rövid leírás a listában)</label>
            <textarea
              value={editingPost.excerpt}
              onChange={e => setEditingPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Rövid összefoglaló a bejegyzéshez..."
            />
          </div>

          {/* Month & Reading Time row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hónap</label>
              <select
                value={editingPost.month}
                onChange={e => {
                  const selectedMonth = MONTH_OPTIONS.find(m => m.value === e.target.value);
                  setEditingPost(prev => prev ? {
                    ...prev,
                    month: e.target.value,
                    monthLabel: (selectedMonth && 'monthLabel' in selectedMonth ? selectedMonth.monthLabel : '') || '',
                  } : null);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              >
                {MONTH_OPTIONS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Olvasási idő</label>
              <input
                type="text"
                value={editingPost.readingTime}
                onChange={e => setEditingPost(prev => prev ? { ...prev, readingTime: e.target.value } : null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="2,5 perc olvasás"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Szerző</label>
              <input
                type="text"
                value={editingPost.authorName}
                onChange={e => setEditingPost(prev => prev ? { ...prev, authorName: e.target.value } : null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Szerző neve"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Borítókép URL</label>
            <input
              type="text"
              value={editingPost.coverImage}
              onChange={e => setEditingPost(prev => prev ? { ...prev, coverImage: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="https://..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tartalom (HTML) *
            </label>
            <textarea
              value={editingPost.content}
              onChange={e => setEditingPost(prev => prev ? { ...prev, content: e.target.value } : null)}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm dark:bg-gray-800 dark:text-gray-100"
              placeholder="<h2>Cím</h2><p>Tartalom...</p>"
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editingPost.published}
                onChange={e => setEditingPost(prev => prev ? { ...prev, published: e.target.checked } : null)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {editingPost.published ? 'Publikálva' : 'Piszkozat'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving || !editingPost.title || !editingPost.content}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
            <button
              onClick={() => { setEditingPost(null); setEditingId(null); }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
              Mégse
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog kezelés</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Bejegyzések kezelése és szerkesztése</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Új bejegyzés
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">Betöltés...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Még nincs bejegyzés</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6">Hozd létre az első blog bejegyzésedet.</p>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Új bejegyzés
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cím</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hónap</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Státusz</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Létrehozva</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {post.monthLabel || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {post.published ? (
                        <><Eye size={12} /> Publikálva</>
                      ) : (
                        <><EyeOff size={12} /> Piszkozat</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('hu-HU')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-emerald-600 transition-colors"
                        title={post.published ? 'Elrejtés' : 'Publikálás'}
                      >
                        {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-colors"
                        title="Szerkesztés"
                      >
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirm === post.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Törlés
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                          >
                            Mégse
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors"
                          title="Törlés"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
