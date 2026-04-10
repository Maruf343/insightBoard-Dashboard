'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';
import Modal from '../../components/Modal';
import type { User } from 'firebase/auth';

type DataItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const categories = ['All', 'Sales', 'Marketing', 'Support', 'Operations'];
const statuses = ['Active', 'Paused', 'Archived'];

export default function DataPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState<DataItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DataItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Sales', status: 'Active' });
  const [statusMessage, setStatusMessage] = useState('Ready');

  const refreshItems = useCallback(async (requestedPage = 1) => {
    if (!currentUser) return;
    const params = new URLSearchParams({
      userId: currentUser.uid,
      page: String(requestedPage),
      pageSize: String(pageSize),
      sortField,
      sortDirection,
    });
    if (category !== 'All') params.set('category', category);
    if (statusFilter !== 'All') params.set('status', statusFilter);
    if (keyword) params.set('keyword', keyword);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    const response = await fetch(`/api/data?${params.toString()}`);
    if (!response.ok) return;
    const payload = await response.json();
    setItems(payload.items);
    setTotal(payload.total);
    setPage(payload.page);
  }, [currentUser, category, endDate, keyword, pageSize, startDate, sortDirection, sortField, statusFilter]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuth() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setAuthLoading(false);
      });
    }

    initAuth();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      setPage(1);
      refreshItems(1);
    }
  }, [currentUser, refreshItems]);

  useEffect(() => {
    if (currentUser) {
      refreshItems(page);
    }
  }, [currentUser, page, refreshItems]);

  const handleEdit = (item: DataItem) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description, category: item.category, status: item.status });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditItem(null);
    setForm({ title: '', description: '', category: 'Sales', status: 'Active' });
  };

  const saveItem = async () => {
    if (!currentUser || !form.title.trim()) return;
    setIsSaving(true);
    const body = {
      userId: currentUser.uid,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      status: form.status,
    };

    const url = editItem ? `/api/data/${editItem.id}?userId=${currentUser.uid}` : '/api/data';
    const method = editItem ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setStatusMessage('Unable to save item.');
      setIsSaving(false);
      return;
    }

    setStatusMessage(editItem ? 'Item updated successfully.' : 'Item created successfully.');
    setModalOpen(false);
    resetForm();
    setIsSaving(false);
    refreshItems(page);
  };

  const deleteItem = async (item: DataItem) => {
    if (!currentUser || !confirm('Delete this item?')) return;
    const response = await fetch(`/api/data/${item.id}?userId=${currentUser.uid}`, { method: 'DELETE' });
    if (!response.ok) {
      setStatusMessage('Unable to delete item.');
      return;
    }
    setStatusMessage('Item deleted.');
    refreshItems(page);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (authLoading) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-lg font-semibold">Checking authentication...</p>
            <p className="max-w-md text-sm text-muted">Loading your data management workspace.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-panel bg-panel/95 p-8 text-center shadow-panel">
          <p className="text-lg font-semibold">Sign in to manage your data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base px-6 py-10 text-base text-white sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Data workspace</p>
              <h1 className="mt-3 text-4xl font-semibold">Manage your records</h1>
              <p className="mt-4 max-w-2xl text-muted">Create, search, filter, sort and paginate your user-specific data items stored in PostgreSQL.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              New record
            </button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.3fr_0.7fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-muted">
                Search
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Keyword or title"
                  className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
              <label className="block text-sm text-muted">
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-muted">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                >
                  <option value="All">All</option>
                  {statuses.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-muted">
                Date from
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
              <label className="block text-sm text-muted">
                Date to
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Filtered results</p>
              <h2 className="mt-2 text-2xl font-semibold">Records</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortField}
                onChange={(event) => setSortField(event.target.value)}
                className="rounded-3xl border border-panel bg-surface/90 px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
              >
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))}
                className="rounded-full border border-panel bg-surface/90 px-4 py-3 text-sm text-white transition hover:bg-panel"
              >
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-muted">
              <thead>
                <tr className="border-b border-panel text-sm uppercase tracking-[0.24em] text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/80">
                      <td className="px-4 py-4 font-semibold text-white">{item.title}</td>
                      <td className="px-4 py-4 text-muted">{item.category}</td>
                      <td className="px-4 py-4 text-muted">{item.status}</td>
                      <td className="px-4 py-4 text-muted">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded-full border border-panel bg-surface px-4 py-2 text-sm font-medium transition hover:bg-brand/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="rounded-full border border-rose-500 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted">
                      No records found. Adjust the filters or create a new item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Showing page {page} of {totalPages}.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-panel bg-surface px-4 py-2 text-sm text-white transition hover:bg-panel"
                disabled={page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-full border border-panel bg-surface px-4 py-2 text-sm text-white transition hover:bg-panel"
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] border border-panel bg-surface/90 p-4 text-sm text-muted">
            {statusMessage}
          </div>
        </div>
      </div>

      <Modal
        title={editItem ? 'Edit record' : 'Create record'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:bg-panel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveItem}
              disabled={isSaving}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : editItem ? 'Save changes' : 'Create record'}
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-muted">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
            />
          </label>
          <label className="block text-sm text-muted">
            Category
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
            >
              {categories.filter((cat) => cat !== 'All').map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-muted sm:col-span-2">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="mt-3 w-full rounded-[28px] border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
            />
          </label>
          <label className="block text-sm text-muted">
            Status
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
            >
              {statuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Modal>
    </main>
  );
}
