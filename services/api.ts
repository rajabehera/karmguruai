
import { User, PlanType, Resume, ActivityItem, LeaderboardEntry, Badge, Quest, View, Notification, ForumPost, AdminStats, AnalyticsData } from '../types';
import { Award, Zap, Star, Shield, Code, Mic2, Users, Flame, Target } from 'lucide-react';

const DELAY = 500;

const mockDb = {
  getUsers: (): User[] => {
    const users = localStorage.getItem('nexus_mock_users');
    return users ? JSON.parse(users) : [];
  },
  saveUser: (user: User) => {
    const users = mockDb.getUsers();
    users.push(user);
    localStorage.setItem('nexus_mock_users', JSON.stringify(users));
  },
  updateUser: (updatedUser: User) => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('nexus_mock_users', JSON.stringify(users));
    }
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const countries = ['IN', 'US', 'UK', 'CA', 'DE', 'AU', 'FR'];
const names = ['Aarav', 'Sophia', 'Liam', 'Priya', 'Noah', 'Emma', 'Rohan', 'Olivia', 'Ethan', 'Ava'];

const checkCookieConsent = (type: 'analytics' | 'personalization' | 'marketing'): boolean => {
  try {
    const stored = localStorage.getItem('karmguru_cookie_consent');
    if (!stored) return false;
    const prefs = JSON.parse(stored);
    return prefs[type] === true;
  } catch (e) {
    return false;
  }
};

// Helper for dates
const getDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const api = {
  auth: {
    register: async (data: any): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      
      if (users.find(u => u.email === data.email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        plan: 'FREE',
        credits: {
          interviews: 3,
          aiAnalysis: 5
        },
        xp: 0,
        joinedDate: new Date().toLocaleDateString(),
        onboarded: false,
        resumes: [],
        notifications: [
            {
                id: 'welcome',
                title: 'Welcome to KarmGuruAI',
                message: 'Your journey to career excellence begins now. Complete onboarding to earn XP.',
                type: 'INFO',
                timestamp: new Date().toISOString(),
                read: false,
                link: View.ONBOARDING
            }
        ],
        country: 'IN',
        stats: {
          streak: 0,
          totalXp: 0,
          interviewsCompleted: 0,
          problemsSolved: 0,
          testsTaken: 0,
          avgTestScore: 0,
          skills: {
            technical: 0,
            communication: 0,
            problemSolving: 0
          },
          recentActivity: []
        }
      };
      
      // Auto-Admin for demo if email contains 'admin'
      if (data.email.includes('admin')) newUser.role = 'ADMIN';

      (newUser as any).password = data.password;

      mockDb.saveUser(newUser);
      localStorage.setItem('nexus_token', 'mock-jwt-token-' + newUser.id);
      return newUser;
    },

    login: async (data: any): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === data.email && (u as any).password === data.password);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('nexus_token', 'mock-jwt-token-' + user.id);
      return user;
    }
  },

  user: {
    upgrade: async (email: string, plan: PlanType): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === email);

      if (!user) throw new Error('User not found');

      user.plan = plan;
      user.credits = {
        interviews: -1, // Unlimited
        aiAnalysis: 50
      };

      // Notification
      if (!user.notifications) user.notifications = [];
      user.notifications.unshift({
          id: Date.now().toString(),
          title: 'Plan Upgraded',
          message: `You are now on the ${plan} plan. Enjoy your premium features!`,
          type: 'SUCCESS',
          timestamp: new Date().toISOString(),
          read: false
      });

      mockDb.updateUser(user);
      return user;
    },

    addXp: async (email: string, xpAmount: number) => {
      setTimeout(() => {
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
          const oldLevel = Math.floor(user.stats.totalXp / 1000) + 1;
          user.xp += xpAmount;
          user.stats.totalXp += xpAmount;
          const newLevel = Math.floor(user.stats.totalXp / 1000) + 1;

          if (newLevel > oldLevel) {
              if (!user.notifications) user.notifications = [];
              user.notifications.unshift({
                  id: Date.now().toString(),
                  title: 'Level Up!',
                  message: `Congratulations! You reached Level ${newLevel}. Check the Leaderboard.`,
                  type: 'SUCCESS',
                  timestamp: new Date().toISOString(),
                  read: false,
                  link: View.LEADERBOARD
              });
          }
          mockDb.updateUser(user);
        }
      }, 100);
    },

    logActivity: async (email: string, activity: ActivityItem) => {
        if (!checkCookieConsent('analytics')) {
          console.log("Analytics cookie declined. Activity not logged.");
          return;
        }

        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            const oldLevel = Math.floor(user.stats.totalXp / 1000) + 1;

            if (activity.type === 'INTERVIEW') {
                user.stats.interviewsCompleted += 1;
                user.xp += 50;
                user.stats.totalXp += 50;
            } else if (activity.type === 'CODE') {
                user.stats.problemsSolved += 1;
                user.xp += 20;
                user.stats.totalXp += 20;
            } else if (activity.type === 'EXAM') {
                user.stats.testsTaken += 1;
                user.xp += 30;
                user.stats.totalXp += 30;
            }

            const newLevel = Math.floor(user.stats.totalXp / 1000) + 1;
            if (newLevel > oldLevel) {
                if (!user.notifications) user.notifications = [];
                user.notifications.unshift({
                    id: Date.now().toString(),
                    title: 'Level Up!',
                    message: `Congratulations! You've reached Level ${newLevel}.`,
                    type: 'SUCCESS',
                    timestamp: new Date().toISOString(),
                    read: false,
                    link: View.LEADERBOARD
                });
            }

            user.stats.recentActivity.unshift(activity);
            if (user.stats.recentActivity.length > 10) user.stats.recentActivity.pop();
            mockDb.updateUser(user);
        }
    },

    completeOnboarding: async (email: string): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        user.onboarded = true;
        user.xp = 100;
        user.stats.totalXp = 100;
        user.stats.streak = 1;
        
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            id: Date.now().toString(),
            title: 'Onboarding Complete',
            message: 'You earned 100 XP for getting started!',
            type: 'SUCCESS',
            timestamp: new Date().toISOString(),
            read: false
        });

        mockDb.updateUser(user);
        return user;
      }
      throw new Error("User not found");
    },

    uploadResume: async (email: string, resume: Resume): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        if (user.resumes.length === 0) {
            resume.isActive = true;
            if (!user.notifications) user.notifications = [];
            user.notifications.unshift({
                id: Date.now().toString(),
                title: 'Resume Uploaded',
                message: 'Your profile strength just increased! Use Job Match now.',
                type: 'INFO',
                timestamp: new Date().toISOString(),
                read: false,
                link: View.JOB_SEARCH
            });
        }
        user.resumes.push(resume);
        mockDb.updateUser(user);
        return user;
      }
      throw new Error("User not found");
    },

    deleteResume: async (email: string, resumeId: string): Promise<User> => {
       await wait(DELAY);
       const users = mockDb.getUsers();
       const user = users.find(u => u.email === email);
       if (user) {
         user.resumes = user.resumes.filter(r => r.id !== resumeId);
         if (user.resumes.length > 0 && !user.resumes.find(r => r.isActive)) {
           user.resumes[0].isActive = true;
         }
         mockDb.updateUser(user);
         return user;
       }
       throw new Error("User not found");
    },

    setActiveResume: async (email: string, resumeId: string): Promise<User> => {
      await wait(DELAY);
      const users = mockDb.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        user.resumes.forEach(r => r.isActive = (r.id === resumeId));
        mockDb.updateUser(user);
        return user;
      }
      throw new Error("User not found");
    },

    updateProfileImage: async (email: string, imageBase64: string): Promise<User> => {
        await wait(DELAY);
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            user.avatar = imageBase64;
            mockDb.updateUser(user);
            return user;
        }
        throw new Error("User not found");
    },

    updateCoverImage: async (email: string, imageBase64: string): Promise<User> => {
        await wait(DELAY);
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            user.coverImage = imageBase64;
            mockDb.updateUser(user);
            return user;
        }
        throw new Error("User not found");
    },

    changePassword: async (email: string, oldPass: string, newPass: string): Promise<void> => {
        await wait(DELAY);
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            // @ts-ignore
            if (user.password !== oldPass) {
                throw new Error("Incorrect current password");
            }
            // @ts-ignore
            user.password = newPass;
            
            if (!user.notifications) user.notifications = [];
            user.notifications.unshift({
                id: Date.now().toString(),
                title: 'Security Alert',
                message: 'Your password was changed successfully.',
                type: 'WARNING',
                timestamp: new Date().toISOString(),
                read: false
            });

            mockDb.updateUser(user);
            return;
        }
        throw new Error("User not found");
    },

    markNotificationRead: async (email: string, notificationId: string): Promise<void> => {
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user && user.notifications) {
            const notif = user.notifications.find(n => n.id === notificationId);
            if (notif) notif.read = true;
            mockDb.updateUser(user);
        }
    },

    markAllNotificationsRead: async (email: string): Promise<void> => {
        const users = mockDb.getUsers();
        const user = users.find(u => u.email === email);
        if (user && user.notifications) {
            user.notifications.forEach(n => n.read = true);
            mockDb.updateUser(user);
        }
    },

    getAnalytics: async (email: string): Promise<AnalyticsData> => {
        await wait(DELAY);
        // Simulate personalized data
        return {
            xpGrowth: [
                { date: getDate(6), xp: 100 },
                { date: getDate(5), xp: 350 },
                { date: getDate(4), xp: 450 },
                { date: getDate(3), xp: 800 },
                { date: getDate(2), xp: 950 },
                { date: getDate(1), xp: 1200 },
                { date: getDate(0), xp: 1450 },
            ],
            skillRadar: [
                { subject: 'Coding', A: 85, fullMark: 100 },
                { subject: 'System Design', A: 65, fullMark: 100 },
                { subject: 'Behavioral', A: 90, fullMark: 100 },
                { subject: 'Communication', A: 75, fullMark: 100 },
                { subject: 'Aptitude', A: 60, fullMark: 100 },
            ],
            interviewPerformance: [
                { id: 1, score: 65, date: getDate(10) },
                { id: 2, score: 72, date: getDate(7) },
                { id: 3, score: 85, date: getDate(3) },
                { id: 4, score: 92, date: getDate(1) },
            ]
        };
    }
  },

  forum: {
      getPosts: async (): Promise<ForumPost[]> => {
          await wait(DELAY);
          return [
              { id: '1', authorId: 'u1', authorName: 'Sarah Jenkins', title: 'How to handle "What is your weakness?"', content: 'I always struggle with this question in HR rounds. Any tips?', tags: ['Interview', 'HR'], upvotes: 24, comments: 5, createdAt: getDate(1), isSolved: false },
              { id: '2', authorId: 'u2', authorName: 'David Chen', title: 'React useEffect dependency array confusion', content: 'When exactly should I include functions in the dependency array?', tags: ['Coding', 'React'], upvotes: 12, comments: 2, createdAt: getDate(2), isSolved: true },
              { id: '3', authorId: 'u3', authorName: 'Alex Rivera', title: 'System Design: SQL vs NoSQL', content: 'For a chat application, which database is better and why?', tags: ['System Design', 'Backend'], upvotes: 45, comments: 12, createdAt: getDate(0), isSolved: false }
          ];
      }
  },

  admin: {
      getStats: async (): Promise<AdminStats> => {
          await wait(DELAY);
          return {
              totalUsers: 12543,
              activeUsers: 8432,
              revenue: 45200,
              interviewsConducted: 3421
          };
      },
      getUsers: async (): Promise<User[]> => {
          await wait(DELAY);
          return mockDb.getUsers();
      }
  },

  leaderboard: {
    getLeaderboard: async (period: 'DAILY' | 'WEEKLY' | 'MONTHLY', scope: 'GLOBAL' | 'COUNTRY', userCountry: string = 'IN'): Promise<LeaderboardEntry[]> => {
      await wait(DELAY);
      
      const multiplier = period === 'DAILY' ? 1 : period === 'WEEKLY' ? 5 : 20;
      const count = 50;
      const data: LeaderboardEntry[] = [];

      for (let i = 0; i < count; i++) {
        const country = scope === 'COUNTRY' ? userCountry : countries[randomInt(0, countries.length - 1)];
        data.push({
          rank: i + 1,
          userId: `user-${i}`,
          name: `${names[randomInt(0, names.length - 1)]} ${String.fromCharCode(65 + i)}`,
          xp: randomInt(500, 2000) * multiplier - (i * 10 * multiplier),
          country: country,
          trend: Math.random() > 0.5 ? 'UP' : Math.random() > 0.5 ? 'DOWN' : 'SAME',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
          isCurrentUser: false
        });
      }
      
      // Inject current user randomly if not top 50 (simulation)
      // For demo, we assume current user is rank 12
      data[11].isCurrentUser = true;
      data[11].name = "You";
      
      return data;
    },

    getBadges: async (user: User): Promise<Badge[]> => {
      await wait(DELAY);
      const stats = user.stats;
      
      return [
        {
          id: 'b1', name: 'Voice Virtuoso', description: 'Complete 10 Voice Interviews',
          icon: Mic2, tier: 'BRONZE', requirement: '10 Interviews',
          progress: (stats.interviewsCompleted / 10) * 100, isUnlocked: stats.interviewsCompleted >= 10, xpReward: 500,
          redirectView: View.MOCK_INTERVIEW
        },
        {
          id: 'b2', name: 'Consistency King', description: 'Maintain a 7-day streak',
          icon: Flame, tier: 'SILVER', requirement: '7 Day Streak',
          progress: (stats.streak / 7) * 100, isUnlocked: stats.streak >= 7, xpReward: 1000,
          redirectView: View.DASHBOARD
        },
        {
          id: 'b3', name: 'Code Ninja', description: 'Solve 50 Coding Problems',
          icon: Code, tier: 'GOLD', requirement: '50 Problems',
          progress: (stats.problemsSolved / 50) * 100, isUnlocked: stats.problemsSolved >= 50, xpReward: 2500,
          redirectView: View.CODE_LAB
        },
        {
          id: 'b4', name: 'Exam Topper', description: 'Score 90%+ in 5 Mock Tests',
          icon: Award, tier: 'PLATINUM', requirement: '5 High Scores',
          progress: (stats.testsTaken / 5) * 100, isUnlocked: stats.testsTaken >= 5 && stats.avgTestScore > 90, xpReward: 5000,
          redirectView: View.EXAM_PREP
        },
        {
          id: 'b5', name: 'Nexus Legend', description: 'Reach 10,000 Total XP within 28 Days',
          icon: Shield, tier: 'DIAMOND', requirement: '10k XP (Monthly)',
          progress: (stats.totalXp / 10000) * 100, isUnlocked: stats.totalXp >= 10000, xpReward: 10000,
          redirectView: View.LEADERBOARD
        }
      ];
    },

    getDailyQuests: async (): Promise<Quest[]> => {
      await wait(DELAY);
      return [
        { id: 'q1', title: 'Complete 1 Mock Interview', xp: 150, isCompleted: false, progress: 0, total: 1, redirectView: View.MOCK_INTERVIEW },
        { id: 'q2', title: 'Solve 3 Coding Problems', xp: 100, isCompleted: false, progress: 1, total: 3, redirectView: View.CODE_LAB },
        { id: 'q3', title: 'Score 80%+ in Exam Prep', xp: 200, isCompleted: false, progress: 0, total: 1, redirectView: View.EXAM_PREP },
        { id: 'q4', title: 'Practice 20 English Phrases', xp: 50, isCompleted: true, progress: 20, total: 20, redirectView: View.ENGLISH_COACH },
      ];
    }
  }
};
