
import React, { useState, useEffect } from 'react';
import { User, ForumPost } from '../../types';
import { api } from '../../services/api';
import { MessageSquare, ThumbsUp, Plus, Search, Tag, User as UserIcon, CheckCircle } from 'lucide-react';

const CommunityForum: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    const loadPosts = async () => {
        const data = await api.forum.getPosts();
        setPosts(data);
    };
    loadPosts();
  }, []);

  const handleCreate = async () => {
      const post: Partial<ForumPost> = {
          title: newPost.title,
          content: newPost.content,
          tags: newPost.tags.split(',').map(t => t.trim()),
          authorName: user.name,
          authorId: user.id
      };
      setPosts([{ 
          id: Date.now().toString(), ...post, upvotes: 0, comments: 0, createdAt: new Date().toISOString().split('T')[0], isSolved: false 
      } as ForumPost, ...posts]);
      setShowCreate(false);
      setNewPost({ title: '', content: '', tags: '' });
  };

  const filteredPosts = posts.filter(p => 
      (filter === 'All' || p.tags.includes(filter)) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-karm-light">
      <div className="h-16 border-b border-karm-sage flex items-center justify-between px-6 bg-white z-20 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-karm-dark rounded-lg flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-karm-gold" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-karm-dark">Community <span className="text-karm-gold">Forum</span></h1>
         </div>
         <button 
            onClick={() => setShowCreate(true)}
            className="bg-karm-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1F2130]"
         >
            <Plus className="w-4 h-4" /> Ask Question
         </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
         <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search topics, questions, or tags..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-karm-sage bg-white focus:border-karm-gold outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Interview', 'Coding', 'Resume'].map(f => (
                        <button 
                           key={f}
                           onClick={() => setFilter(f)}
                           className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-karm-dark text-white' : 'bg-white border border-karm-sage text-gray-500 hover:bg-gray-50'}`}
                        >
                           {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredPosts.map(post => (
                    <div key={post.id} className="glass-panel p-6 rounded-2xl bg-white border border-karm-sage hover:border-karm-gold transition-all shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-karm-gold"><ThumbsUp className="w-5 h-5"/></button>
                                <span className="text-sm font-bold text-karm-dark">{post.upvotes}</span>
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-karm-dark hover:text-karm-gold cursor-pointer transition-colors">{post.title}</h3>
                                    {post.isSolved && (
                                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3"/> SOLVED
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 rounded flex items-center gap-1">
                                                <Tag className="w-3 h-3"/> {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="w-3 h-3"/> {post.authorName}
                                        </div>
                                        <span>{post.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

         </div>
      </div>

      {showCreate && (
          <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Ask the Community</h3>
                  <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Title (e.g. How to optimize React context?)"
                        className="w-full p-3 border rounded-lg outline-none focus:border-karm-gold"
                        value={newPost.title}
                        onChange={e => setNewPost({...newPost, title: e.target.value})}
                      />
                      <textarea 
                        placeholder="Describe your question in detail..."
                        className="w-full p-3 border rounded-lg outline-none focus:border-karm-gold h-32 resize-none"
                        value={newPost.content}
                        onChange={e => setNewPost({...newPost, content: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Tags (comma separated)"
                        className="w-full p-3 border rounded-lg outline-none focus:border-karm-gold"
                        value={newPost.tags}
                        onChange={e => setNewPost({...newPost, tags: e.target.value})}
                      />
                      <div className="flex justify-end gap-3 mt-4">
                          <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-500 hover:text-karm-dark">Cancel</button>
                          <button onClick={handleCreate} className="px-6 py-2 bg-karm-dark text-white rounded-lg font-bold">Post Question</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CommunityForum;
