'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CommunityPostCard from '@/app/components/CommunityPostCard';
import CreatePostForm from '@/app/components/CreatePostForm';
import { HiPlus, HiFilter } from 'react-icons/hi';

interface Post {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_roll_no?: string;
  author_type: 'student' | 'professor';
  class_name: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  created_at: string;
  is_pinned: boolean;
}

interface Class {
  id: number;
  name: string;
}

export default function StudentCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<number, string>>({});
  const router = useRouter();

  // Initialize tables on first load
  useEffect(() => {
    initializeTables();
  }, []);

  // Fetch data when component mounts or class filter changes
  useEffect(() => {
    if (classes.length > 0) {
      fetchPosts();
    }
  }, [selectedClassId, classes]);

  const initializeTables = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.get('http://localhost:8080/api/v1/student/community/init', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      await fetchClasses();
    } catch (error) {
      console.error('Error initializing tables:', error);
      setError('Failed to initialize community features');
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Get student's class information
      const profileResponse = await axios.get('http://localhost:8080/api/v1/student/profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (profileResponse.data.success && profileResponse.data.data.class_id) {
        const studentClass = {
          id: profileResponse.data.data.class_id,
          name: profileResponse.data.data.class_name || 'My Class'
        };
        setClasses([studentClass]);
        setSelectedClassId(studentClass.id);
      } else {
        setError('No class assigned to student');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to fetch class information');
        setLoading(false);
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (selectedClassId) {
        params.append('classId', selectedClassId.toString());
      }
      params.append('limit', '20');
      params.append('offset', '0');

      const response = await axios.get(
        `http://localhost:8080/api/v1/student/community/posts?${params}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPosts(response.data.data);
        await fetchUserVotes(response.data.data.map((post: Post) => post.id));
      } else {
        setError(response.data.message || 'Failed to fetch posts');
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to fetch posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async (postIds: number[]) => {
    if (postIds.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        targetIds: postIds.join(','),
        targetType: 'post',
        userType: 'student'
      });

      const response = await axios.get(
        `http://localhost:8080/api/v1/student/community/votes?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserVotes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleCreatePost = async (postData: { title: string; content: string; classId: number }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/v1/student/community/posts',
        {
          ...postData,
          authorType: 'student'
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setShowCreateForm(false);
        fetchPosts(); // Refresh posts
      } else {
        setError(response.data.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleVote = async (postId: number, voteType: 'upvote' | 'downvote') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/v1/student/community/vote/${postId}`,
        {
          userType: 'student',
          targetType: 'post',
          voteType
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update post vote counts
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, upvotes: response.data.data.upvotes, downvotes: response.data.data.downvotes }
              : post
          )
        );

        // Update user votes
        setUserVotes(prev => {
          const newVotes = { ...prev };
          if (response.data.data.action === 'removed') {
            delete newVotes[postId];
          } else {
            newVotes[postId] = voteType;
          }
          return newVotes;
        });
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      setError(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handlePostClick = (postId: number) => {
    router.push(`/student/community/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                initializeTables();
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <p className="text-gray-600 mt-1">Connect with your classmates and professors</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <HiPlus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Class Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            <HiFilter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Filter by class:</span>
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value ? parseInt(e.target.value) : null)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="mb-6">
            <CreatePostForm
              classes={classes}
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreateForm(false)}
              defaultClassId={selectedClassId}
            />
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <p className="text-gray-500 text-lg">No posts yet</p>
              <p className="text-gray-400 mt-2">Be the first to start a discussion!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map(post => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onVote={(voteType) => handleVote(post.id, voteType)}
                onClick={() => handlePostClick(post.id)}
                userVote={userVotes[post.id]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}