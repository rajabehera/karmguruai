
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, User, ArrowRight, Tag, Clock, Share2 } from 'lucide-react';
import Footer from './Footer';
import { View } from '../types';

interface BlogProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const POSTS = [
  {
    id: 1,
    title: "Mastering the AI Interview: Top Tips for 2024",
    excerpt: "Discover how AI-driven interviews work and what you can do to score in the top 1% of candidates.",
    author: "Sarah Jenkins",
    role: "HR Tech Expert",
    date: "Oct 20, 2024",
    category: "Interview Prep",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
    content: `
      <p class="mb-4">Artificial Intelligence is revolutionizing the recruitment landscape. As more companies adopt AI-driven interview platforms, candidates must adapt their preparation strategies to stand out.</p>
      <h3 class="text-xl font-bold mb-2">Understanding the Algorithm</h3>
      <p class="mb-4">AI interviewers analyze more than just your words. They evaluate your tone, pace, and even facial expressions in video interviews. However, the core focus remains on the content of your answers.</p>
      <h3 class="text-xl font-bold mb-2">The STAR Method 2.0</h3>
      <p class="mb-4">While the traditional STAR method (Situation, Task, Action, Result) is still relevant, AI algorithms prefer structured, data-driven responses. Quantify your achievements whenever possible.</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Be Specific:</strong> Avoid vague statements. Instead of "I improved sales," say "I increased sales by 20% in Q3."</li>
        <li><strong>Keywords Matter:</strong> Review the job description and naturally incorporate key skills and tools into your responses.</li>
        <li><strong>Practice Fluency:</strong> AI tools measure hesitation and clarity. Practice speaking smoothly without too many "umms" and "ahhs."</li>
      </ul>
      <h3 class="text-xl font-bold mb-2">Conclusion</h3>
      <p>Embracing AI tools for preparation, like KarmGuruAI's Mock Interview module, can give you a significant edge. Simulate the environment before the real deal to build confidence and refine your delivery.</p>
    `
  },
  {
    id: 2,
    title: "Why Your Resume Isn't Passing ATS Scanners",
    excerpt: "Common mistakes that get your resume rejected by bots before a human ever sees it.",
    author: "David Chen",
    role: "Career Coach",
    date: "Oct 18, 2024",
    category: "Resume Tips",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
    content: "Content placeholder..."
  },
  {
    id: 3,
    title: "The Future of Coding Assessments",
    excerpt: "How companies are moving away from LeetCode grinding to practical, AI-assisted coding challenges.",
    author: "Alex Rivera",
    role: "Tech Lead",
    date: "Oct 15, 2024",
    category: "Tech Trends",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    readTime: "7 min read",
    content: "Content placeholder..."
  },
  {
    id: 4,
    title: "Soft Skills: The Underrated Superpower",
    excerpt: "Why emotional intelligence matters more than ever in the age of AI.",
    author: "Emily Zhang",
    role: "Psychologist",
    date: "Oct 12, 2024",
    category: "Career Growth",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
    content: "Content placeholder..."
  }
];

const Blog: React.FC<BlogProps> = ({ onBack, onNavigate }) => {
  const [activePost, setActivePost] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePost]);

  const handleRead = (id: number) => {
    setActivePost(id);
  };

  const selectedPost = POSTS.find(p => p.id === activePost);

  return (
    <div className="min-h-screen bg-karm-light flex flex-col font-sans">
      <nav className="h-20 border-b border-karm-sage bg-white flex items-center px-6 md:px-12 sticky top-0 z-50">
        <button onClick={activePost ? () => setActivePost(null) : onBack} className="flex items-center gap-2 text-karm-dark hover:text-karm-gold font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" /> {activePost ? 'Back to Blog' : 'Back to Home'}
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activePost && selectedPost ? (
           // ARTICLE VIEW
           <article className="bg-white">
              <div className="h-96 w-full relative">
                 <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest">
                       <span className="bg-karm-gold text-karm-dark px-2 py-1 rounded">{selectedPost.category}</span>
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {selectedPost.readTime}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{selectedPost.title}</h1>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-5 h-5"/>
                       </div>
                       <div>
                          <div className="font-bold text-sm">{selectedPost.author}</div>
                          <div className="text-xs opacity-70">{selectedPost.role} • {selectedPost.date}</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="max-w-3xl mx-auto py-16 px-6">
                 <div 
                    className="prose prose-lg prose-slate text-karm-dark"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
                 />
                 
                 <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <h4 className="font-bold text-karm-dark">Share this article</h4>
                    <div className="flex gap-2">
                       <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500"><Share2 className="w-4 h-4"/></button>
                    </div>
                 </div>
              </div>
           </article>
        ) : (
           // LIST VIEW
           <>
            <section className="py-20 px-6 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-karm-dark mb-6">Insights & <span className="text-karm-gold">Strategies</span></h1>
                    <p className="text-xl text-karm-muted">Expert advice on navigating the modern career landscape, powered by data and AI.</p>
                  </div>

                  {/* Featured Post */}
                  <div 
                    className="glass-panel p-0 rounded-3xl border border-karm-sage shadow-lg overflow-hidden flex flex-col md:flex-row bg-white cursor-pointer group"
                    onClick={() => handleRead(POSTS[0].id)}
                  >
                    <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        <img src={POSTS[0].image} alt="Featured" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest">
                          <span className="text-karm-gold">{POSTS[0].category}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-400">{POSTS[0].readTime}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-karm-dark mb-4 group-hover:text-karm-gold transition-colors">{POSTS[0].title}</h2>
                        <p className="text-karm-muted mb-8 leading-relaxed">{POSTS[0].excerpt}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User className="w-5 h-5"/></div>
                              <div className="text-sm">
                                <p className="font-bold text-karm-dark">{POSTS[0].author}</p>
                                <p className="text-gray-400">{POSTS[0].date}</p>
                              </div>
                          </div>
                          <button className="w-12 h-12 rounded-full border border-karm-sage flex items-center justify-center hover:bg-karm-dark hover:text-white transition-all">
                              <ArrowRight className="w-5 h-5"/>
                          </button>
                        </div>
                    </div>
                  </div>
              </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {POSTS.slice(1).map(post => (
                    <div 
                        key={post.id} 
                        onClick={() => handleRead(post.id)}
                        className="group glass-panel rounded-2xl border border-karm-sage bg-white overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="h-48 overflow-hidden relative">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-karm-gold">
                              <Tag className="w-3 h-3"/> {post.category}
                          </div>
                          <h3 className="text-xl font-bold text-karm-dark mb-3 line-clamp-2 group-hover:text-karm-gold transition-colors">{post.title}</h3>
                          <p className="text-sm text-gray-500 mb-6 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar className="w-3 h-3"/> {post.date}
                              </div>
                              <span className="text-xs font-bold text-karm-dark hover:underline flex items-center gap-1">Read <ArrowRight className="w-3 h-3"/></span>
                          </div>
                        </div>
                    </div>
                  ))}
              </div>
            </section>
           </>
        )}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Blog;
