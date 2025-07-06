import React, { useState } from 'react';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi2';
import { HiOutlineChat } from 'react-icons/hi';
import { BsReply } from 'react-icons/bs';

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

interface CommentSectionProps {
  comments: Comment[];
  onCommentSubmit: (content: string, parentCommentId?: number) => void;
  userType: 'student' | 'professor';
}

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: number) => void;
  userType: 'student' | 'professor';
  depth?: number;
}

function CommentItem({ comment, onReply, userType, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (comment.author_type === 'professor') {
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

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(replyContent.trim(), comment.id);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const score = comment.upvotes - comment.downvotes;
  const leftMargin = Math.min(depth * 2, 8); // Max depth of 4 levels

  return (
    <div className={`ml-${leftMargin}`}>
      <div className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-200">
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">
            {comment.author_name}
          </span>
          {comment.author_roll_no && (
            <span className="text-gray-500 text-sm">
              ({comment.author_roll_no})
            </span>
          )}
          {getAuthorBadge()}
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-500 text-sm">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>

        {/* Comment Content */}
        <p className="text-gray-700 mb-3">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          {/* Vote score - simplified for comments */}
          <div className="flex items-center gap-1">
            <HiChevronUp className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${
              score > 0 ? 'text-orange-600' : score < 0 ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {score}
            </span>
            <HiChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {/* Reply Button */}
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <BsReply className="w-4 h-4" />
            Reply
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
              rows={3}
              maxLength={2000}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                {replyContent.length}/2000
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="px-4 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({ comments, onCommentSubmit, userType }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (content: string, parentId: number) => {
    await onCommentSubmit(content, parentId);
  };

  // Group comments by parent_comment_id for threaded display
  const rootComments = comments.filter(comment => !comment.parent_comment_id);
  const replyMap = new Map<number, Comment[]>();
  
  comments.forEach(comment => {
    if (comment.parent_comment_id) {
      if (!replyMap.has(comment.parent_comment_id)) {
        replyMap.set(comment.parent_comment_id, []);
      }
      replyMap.get(comment.parent_comment_id)!.push(comment);
    }
  });

  // Recursive function to render comments and their replies
  const renderComment = (comment: Comment, depth = 0): JSX.Element => {
    const replies = replyMap.get(comment.id) || [];
    
    return (
      <div key={comment.id} className="mb-4">
        <CommentItem
          comment={comment}
          onReply={handleReply}
          userType={userType}
          depth={depth}
        />
        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineChat className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
          rows={4}
          maxLength={2000}
          required
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-500">
            {newComment.length}/2000
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {rootComments.length === 0 ? (
          <div className="text-center py-8">
            <HiOutlineChat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          rootComments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
}