import React from 'react';
import { HiChevronUp, HiChevronDown, HiChatBubbleLeft } from 'react-icons/hi2';
import { BsFillPinFill } from 'react-icons/bs';

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

interface CommunityPostCardProps {
  post: Post;
  onVote: (voteType: 'upvote' | 'downvote') => void;
  onClick: () => void;
  userVote?: string;
}

export default function CommunityPostCard({ post, onVote, onClick, userVote }: CommunityPostCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getAuthorBadge = () => {
    if (post.author_type === 'professor') {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          Professor
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
        Student
      </span>
    );
  };

  const score = post.upvotes - post.downvotes;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {post.is_pinned && (
              <BsFillPinFill className="w-4 h-4 text-orange-500 flex-shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {post.author_name}
                </span>
                {post.author_roll_no && (
                  <span className="text-gray-500 text-sm">
                    ({post.author_roll_no})
                  </span>
                )}
                {getAuthorBadge()}
              </div>
              <div className="text-sm text-gray-500">
                {post.class_name} • {formatTimeAgo(post.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-purple-600"
            onClick={onClick}
          >
            {post.title}
          </h3>
          {post.content && (
            <p 
              className="text-gray-700 line-clamp-3 cursor-pointer"
              onClick={onClick}
            >
              {post.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Voting */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote('upvote');
                }}
                className={`p-1 rounded hover:bg-gray-100 ${
                  userVote === 'upvote' ? 'text-orange-500 bg-orange-50' : 'text-gray-500'
                }`}
                title="Upvote"
              >
                <HiChevronUp className="w-5 h-5" />
              </button>
              <span className={`text-sm font-medium min-w-[24px] text-center ${
                score > 0 ? 'text-orange-600' : score < 0 ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {score}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote('downvote');
                }}
                className={`p-1 rounded hover:bg-gray-100 ${
                  userVote === 'downvote' ? 'text-blue-500 bg-blue-50' : 'text-gray-500'
                }`}
                title="Downvote"
              >
                <HiChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Comments */}
            <button
              onClick={onClick}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
            >
              <HiChatBubbleLeft className="w-4 h-4" />
              <span className="text-sm">{post.comment_count}</span>
            </button>
          </div>

          {/* Read more */}
          <button
            onClick={onClick}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View Discussion →
          </button>
        </div>
      </div>
    </div>
  );
}