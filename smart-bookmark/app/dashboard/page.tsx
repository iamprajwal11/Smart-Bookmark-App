"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Search, ExternalLink, LogOut, X, Edit2, User } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Profile Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/");
      else {
        setUser(user);
        fetchBookmarks();
      }
    };
    getUser();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });
    setBookmarks(data || []);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Prefix Search Logic
  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return bookmarks;
    return bookmarks.filter((b) => {
      const titleMatch = b.title.toLowerCase().startsWith(query);
      const cleanUrl = b.url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
      const urlMatch = b.url.toLowerCase().startsWith(query) || cleanUrl.startsWith(query);
      return titleMatch || urlMatch;
    });
  }, [bookmarks, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from("bookmarks")
        .update({ title, url })
        .eq("id", editingId);

      if (!error) {
        setBookmarks(prev => prev.map(b => b.id === editingId ? { ...b, title, url } : b));
        closeModal();
      }
    } else {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({ title, url, user_id: user.id })
        .select();

      if (!error && data) {
        setBookmarks(prev => [data[0], ...prev]);
        closeModal();
      }
    }
    setLoading(false);
  };

  const deleteBookmark = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setBookmarks(prev => prev.filter(b => b.id !== id));
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const openEditModal = (bookmark: any) => {
    setEditingId(bookmark.id);
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle("");
    setUrl("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SB</div>
            <span className="font-bold text-gray-700">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              <Plus size={16} /> Add
            </button>
            
            {/* Google-Style Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200 border-2 border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {getUserInitials()}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xl flex items-center justify-center">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} className="text-gray-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-md font-semibold">My Bookmarks</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Prefix search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full outline-none" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">URL</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookmarks.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{b.title}</td>
                    <td className="px-6 py-4 text-indigo-600 truncate max-w-[200px]">
                      <a href={b.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                        {b.url} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(b)} className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteBookmark(b.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Compact Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? "Edit Bookmark" : "New Bookmark"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Github" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">URL</label>
                <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-bold hover:bg-indigo-700 transition">
                {loading ? "Saving..." : editingId ? "Update Bookmark" : "Save Bookmark"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}