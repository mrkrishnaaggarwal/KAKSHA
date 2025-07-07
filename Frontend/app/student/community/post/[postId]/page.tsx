'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import CommunityPostCard from '@/app/components/CommunityPostCard';
import CommentSection from '@/app/components/CommentSection';
import { HiArrowLeft } from 'react-icons/hi';

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
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_roll_no?: string;
  author_type: 'student' | 'professor';
  upvotes: number;
  downvotes: number;
  created_at: string;
  parent_comment_id: number | null;
}

export default function StudentPostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, string>>({});
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/v1/student/community/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPost(response.data.data);
        await fetchUserVotes([response.data.data.id]);
      } else {
        setError(response.data.message || 'Post not found');
      }
    } catch (error: any) {
      console.error('Error fetching post:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else if (error.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to load post');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async (targetIds: number[]) => {
    if (targetIds.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        targetIds: targetIds.join(','),
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

  const handleVote = async (targetId: number, voteType: 'upvote' | 'downvote') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/v1/student/community/vote/${targetId}`,
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

      if (response.data.success && post) {
        // Update post vote counts
        setPost(prevPost => 
          prevPost ? {
            ...prevPost,
            upvotes: response.data.data.upvotes,
            downvotes: response.data.data.downvotes
          } : null
        );

        // Update user votes
        setUserVotes(prev => {
          const newVotes = { ...prev };
          if (response.data.data.action === 'removed') {
            delete newVotes[targetId];
          } else {
            newVotes[targetId] = voteType;
          }
          return newVotes;
        });
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      setError(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleCommentSubmit = async (content: string, parentCommentId?: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/v1/student/community/posts/${postId}/comments`,
        {
          content,
          authorType: 'student',
          parentCommentId: parentCommentId || null
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
        // Refresh the post to get updated comments
        fetchPost();
      } else {
        setError(response.data.message || 'Failed to post comment');
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      setError(error.response?.data?.message || 'Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error || 'Post not found'}</p>
            <button
              onClick={() => router.push('/student/community')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Back to Community
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-orange-50 to-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <HiArrowLeft className="w-5 h-5" />
          Back to Community
        </button>

        {/* Post */}
        <div className="mb-6">
          <CommunityPostCard
            post={post}
            onVote={(voteType) => handleVote(post.id, voteType)}
            onClick={() => {}} // No action needed, we're already on the post page
            userVote={userVotes[post.id]}
          />
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={post.comments}
          onCommentSubmit={handleCommentSubmit}
          userType="student"
        />
      </div>
    </div>
  );
}