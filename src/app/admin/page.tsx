'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { collection, deleteDoc, doc, onSnapshot, addDoc } from 'firebase/firestore';
import { Sermon, BlogPost, ServiceTime, ContactRequest, Leader } from '../../types';
import { mockSermons, mockBlogPosts, mockServiceTimes } from '../../data/mockData';
import { 
  Video, BookOpen, Clock, Mail, LogOut, Plus, Trash2, Edit, Database, 
  Loader2, ExternalLink, Calendar, User, Search, RefreshCw, MessageSquare, Users
} from 'lucide-react';
import SermonForm from '../../components/admin/SermonForm';
import BlogPostForm from '../../components/admin/BlogPostForm';
import ServiceTimeForm from '../../components/admin/ServiceTimeForm';
import LeaderForm from '../../components/admin/LeaderForm';

type ActiveTab = 'sermons' | 'blogs' | 'services' | 'contacts' | 'leadership';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('sermons');
  
  // Dynamic Firestore Data
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<ServiceTime[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  
  // Data Loading status
  const [dataLoading, setDataLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Form Management states
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);
  const [sermonFormOpen, setSermonFormOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceTime | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);
  const [leaderFormOpen, setLeaderFormOpen] = useState(false);

  const router = useRouter();

  // Step 1: Manage Authorization Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email === 'admin@cbcht.com') {
          setUser(currentUser);
          setAuthLoading(false);
        } else {
          // Force signout if not admin email
          signOut(auth);
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Step 2: Bind Firestore snapshot listeners for real-time reactivity
  useEffect(() => {
    if (!user) return;

    setDataLoading(true);

    const unsubSermons = onSnapshot(collection(db, 'sermons'), (snapshot) => {
      const sermonList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sermon));
      sermonList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSermons(sermonList);
      setDataLoading(false);
    }, (err) => console.error("Sermons fetch error:", err));

    const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      blogList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBlogs(blogList);
    }, (err) => console.error("Blogs fetch error:", err));

    const unsubServices = onSnapshot(collection(db, 'serviceTimes'), (snapshot) => {
      const serviceList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceTime));
      setServices(serviceList);
    }, (err) => console.error("Services fetch error:", err));

    const unsubContacts = onSnapshot(collection(db, 'contactRequests'), (snapshot) => {
      const contactList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactRequest));
      contactList.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      setContacts(contactList);
    }, (err) => console.error("Contacts fetch error:", err));

    const unsubLeaders = onSnapshot(collection(db, 'leadership'), (snapshot) => {
      const leaderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader));
      leaderList.sort((a, b) => a.order - b.order);
      setLeaders(leaderList);
    }, (err) => console.error("Leaders fetch error:", err));

    return () => {
      unsubSermons();
      unsubBlogs();
      unsubServices();
      unsubContacts();
      unsubLeaders();
    };
  }, [user]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Seeder to populate default records if database is empty
  const handleSeedDatabase = async () => {
    if (!confirm('This will seed the database with mock Sermons, Devotionals, and Service Times. Continue?')) {
      return;
    }
    setSeeding(true);
    try {
      // Seed service times
      for (const service of mockServiceTimes) {
        const { id, ...data } = service;
        await addDoc(collection(db, 'serviceTimes'), data);
      }
      // Seed sermons
      for (const sermon of mockSermons) {
        const { id, ...data } = sermon;
        await addDoc(collection(db, 'sermons'), data);
      }
      // Seed devotionals
      for (const blog of mockBlogPosts) {
        const { id, ...data } = blog;
        await addDoc(collection(db, 'blogPosts'), data);
      }
      // Seed default leaders
      const mockLeaders = [
        { name: 'Reverend Lina Sunu Atta', role: 'Head Pastor', order: 1, image: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=2603&auto=format&fit=crop' },
        { name: 'Rev. Emmanuel Mensah', role: 'Associate Pastor', order: 2, image: '' },
        { name: 'Deaconess Mary Appiah', role: "Women's Ministry", order: 3, image: '' }
      ];
      for (const leader of mockLeaders) {
        await addDoc(collection(db, 'leadership'), leader);
      }
      alert('Mock records seeded successfully!');
    } catch (err: any) {
      console.error('Database seeding failed:', err);
      alert('Database seeding failed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-600 font-sans">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-church-blue mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider">Verifying Administrator...</p>
        </div>
      </div>
    );
  }

  const isDbEmpty = sermons.length === 0 && blogs.length === 0 && services.length === 0 && leaders.length === 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-20 font-sans">
      <header className="bg-white border-b border-stone-200 fixed top-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="CBC Halleluyah Temple Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-900 leading-tight">CBC Admin CMS</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Control Management Board</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline-block">Logged in as <b className="text-stone-800">{user?.email}</b></span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:text-red-600 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest text-stone-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-10">
        {/* Empty Database Call to Action */}
        {isDbEmpty && !dataLoading && (
          <div className="mb-10 rounded-none bg-church-blue/5 border border-church-blue/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-church-blue/5">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-2 flex items-center gap-2 text-stone-900">
                <Database className="h-6 w-6 text-church-blue" />
                Empty Database Detected
              </h3>
              <p className="text-stone-500 text-sm max-w-xl">
                No sermons, devotionals, leadership profiles, or service hours exist in your database. Populate mock data instantly to run demo controls.
              </p>
            </div>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="flex items-center gap-2 rounded-none bg-church-blue hover:bg-blue-800 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md disabled:opacity-50"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Seed Database
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <section className="flex flex-wrap items-center justify-between border-b border-stone-200 pb-4 mb-8 gap-4">
          <div className="flex gap-2 p-1 bg-stone-200/50 border border-stone-200 rounded-none">
            {(['sermons', 'blogs', 'services', 'leadership', 'contacts'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-church-blue text-white font-bold shadow-md' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab === 'blogs' ? 'Devotionals' : tab === 'services' ? 'Services' : tab === 'contacts' ? 'Inquiries' : tab === 'leadership' ? 'Leadership' : 'Sermons'}
              </button>
            ))}
          </div>

          {activeTab !== 'contacts' && (
            <button
              onClick={() => {
                if (activeTab === 'sermons') {
                  setActiveSermon(null);
                  setSermonFormOpen(true);
                } else if (activeTab === 'blogs') {
                  setActiveBlog(null);
                  setBlogFormOpen(true);
                } else if (activeTab === 'services') {
                  setActiveService(null);
                  setServiceFormOpen(true);
                } else if (activeTab === 'leadership') {
                  setActiveLeader(null);
                  setLeaderFormOpen(true);
                }
              }}
              className="flex items-center justify-center gap-2 rounded-none bg-church-blue hover:bg-blue-800 py-3.5 px-6 text-xs font-bold uppercase tracking-widest transition-all text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add {activeTab === 'sermons' ? 'Sermon' : activeTab === 'blogs' ? 'Devotional' : activeTab === 'services' ? 'Service' : 'Leader'}
            </button>
          )}
        </section>

        {/* Dashboard Panels */}
        <section className="bg-white border border-stone-200 rounded-none p-6 min-h-[400px] shadow-sm">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin text-church-blue mb-3" />
              <span>Fetching dynamic Firestore content...</span>
            </div>
          ) : (
            <>
              {/* Tab 1: Sermons list */}
              {activeTab === 'sermons' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                        <th className="py-4 px-4">Sermon</th>
                        <th className="py-4 px-4">Date Preached</th>
                        <th className="py-4 px-4">Scripture</th>
                        <th className="py-4 px-4">YouTube ID</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {sermons.map((sermon) => (
                        <tr key={sermon.id} className="hover:bg-stone-50/50">
                          <td className="py-4 px-4 font-bold text-stone-900 flex items-center gap-3">
                            <div className="h-10 w-16 bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center">
                              {sermon.thumbnail ? (
                                <img src={sermon.thumbnail} alt={sermon.title} className="h-full w-full object-cover" />
                              ) : (
                                <Video className="h-4 w-4 text-stone-300" />
                              )}
                            </div>
                            <span className="truncate max-w-[200px]">{sermon.title}</span>
                          </td>
                          <td className="py-4 px-4 text-stone-500">{new Date(sermon.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                          <td className="py-4 px-4 text-stone-600 font-medium">{sermon.scripture || 'N/A'}</td>
                          <td className="py-4 px-4 text-mono text-stone-400 text-xs">{sermon.videoId}</td>
                          <td className="py-4 px-4 text-right space-x-3">
                            <button 
                              onClick={() => {
                                setActiveSermon(sermon);
                                setSermonFormOpen(true);
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-church-blue hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete "${sermon.title}"?`)) {
                                  try {
                                    await deleteDoc(doc(db, 'sermons', sermon.id));
                                  } catch (err: any) {
                                    alert('Delete failed: ' + err.message);
                                  }
                                }
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {sermons.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-stone-500 italic">No sermons found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Devotionals / Blogs list */}
              {activeTab === 'blogs' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                        <th className="py-4 px-4">Title</th>
                        <th className="py-4 px-4">Publish Date</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Author</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {blogs.map((post) => (
                        <tr key={post.id} className="hover:bg-stone-50/50">
                          <td className="py-4 px-4 font-bold text-stone-900 flex items-center gap-3">
                            <div className="h-10 w-14 bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center">
                              {post.image ? (
                                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-stone-300" />
                              )}
                            </div>
                            <span className="truncate max-w-[200px]">{post.title}</span>
                          </td>
                          <td className="py-4 px-4 text-stone-500">{new Date(post.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-church-blue bg-blue-50 border border-blue-100">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-stone-600 font-medium">{post.author}</td>
                          <td className="py-4 px-4 text-right space-x-3">
                            <button 
                              onClick={() => {
                                setActiveBlog(post);
                                setBlogFormOpen(true);
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-church-blue hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                  try {
                                    await deleteDoc(doc(db, 'blogPosts', post.id));
                                  } catch (err: any) {
                                    alert('Delete failed: ' + err.message);
                                  }
                                }
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {blogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-stone-500 italic">No posts found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Service Times list */}
              {activeTab === 'services' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                        <th className="py-4 px-4">Service Name</th>
                        <th className="py-4 px-4">Day</th>
                        <th className="py-4 px-4">Time Slot</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-stone-50/50">
                          <td className="py-4 px-4 font-bold text-stone-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-church-blue" />
                            {service.serviceName}
                          </td>
                          <td className="py-4 px-4 text-stone-700 font-medium">{service.day}</td>
                          <td className="py-4 px-4 text-stone-500">{service.time}</td>
                          <td className="py-4 px-4 text-right space-x-3">
                            <button 
                              onClick={() => {
                                // Open form for editing
                                setActiveService(service);
                                setServiceFormOpen(true);
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-church-blue hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
                                  try {
                                    await deleteDoc(doc(db, 'serviceTimes', service.id));
                                  } catch (err: any) {
                                    alert('Delete failed: ' + err.message);
                                  }
                                }
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-stone-500 italic">No services listed.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 4: Leadership team list */}
              {activeTab === 'leadership' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                        <th className="py-4 px-4">Photo</th>
                        <th className="py-4 px-4">Name</th>
                        <th className="py-4 px-4">Role / Position</th>
                        <th className="py-4 px-4">Order Sequence</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {leaders.map((leader) => (
                        <tr key={leader.id} className="hover:bg-stone-50/50">
                          <td className="py-4 px-4">
                            <div className="h-10 w-10 bg-stone-100 border border-stone-200 overflow-hidden rounded-none">
                              {leader.image ? (
                                <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-stone-300">
                                  <Users className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-stone-900">{leader.name}</td>
                          <td className="py-4 px-4 text-stone-600 font-medium">{leader.role}</td>
                          <td className="py-4 px-4 text-stone-500">{leader.order}</td>
                          <td className="py-4 px-4 text-right space-x-3">
                            <button 
                              onClick={() => {
                                setActiveLeader(leader);
                                setLeaderFormOpen(true);
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-church-blue hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${leader.name}?`)) {
                                  try {
                                    await deleteDoc(doc(db, 'leadership', leader.id));
                                  } catch (err: any) {
                                    alert('Delete failed: ' + err.message);
                                  }
                                }
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {leaders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-stone-500 italic">No leaders listed. Falls back to default leadership list.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 5: Inquiries / Contacts list */}
              {activeTab === 'contacts' && (
                <div className="space-y-6">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border border-stone-200 p-6 rounded-none bg-stone-50/50 shadow-sm flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-church-blue mb-1 block">
                            Visitor Inquiry
                          </span>
                          <h4 className="text-lg font-serif font-bold text-stone-900 mb-1">
                            {contact.subject || 'No Subject'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-medium">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {contact.name}</span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> 
                              <a href={`mailto:${contact.email}`} className="hover:text-church-blue hover:underline transition-colors">{contact.email}</a>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                            Received Date
                          </span>
                          <span className="text-xs text-stone-500">
                            {contact.timestamp ? new Date(contact.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-none border border-stone-200 p-4 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                        {contact.message}
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="text-center py-20 text-stone-500 italic">
                      <MessageSquare className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                      No contact requests received yet.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Sermons Add/Edit Modal */}
      {sermonFormOpen && (
        <SermonForm 
          sermon={activeSermon}
          onClose={() => {
            setSermonFormOpen(false);
            setActiveSermon(null);
          }}
        />
      )}

      {/* Devotional Add/Edit Modal */}
      {blogFormOpen && (
        <BlogPostForm 
          post={activeBlog}
          onClose={() => {
            setBlogFormOpen(false);
            setActiveBlog(null);
          }}
        />
      )}

      {/* Service Time Add/Edit Modal */}
      {serviceFormOpen && (
        <ServiceTimeForm 
          serviceTime={activeService}
          onClose={() => {
            setServiceFormOpen(false);
            setActiveService(null);
          }}
        />
      )}

      {/* Leadership Add/Edit Modal */}
      {leaderFormOpen && (
        <LeaderForm 
          leader={activeLeader}
          onClose={() => {
            setLeaderFormOpen(false);
            setActiveLeader(null);
          }}
        />
      )}
    </div>
  );
}
