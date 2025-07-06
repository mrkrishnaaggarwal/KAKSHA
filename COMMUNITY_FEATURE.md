# Reddit-like Student Community Feature

This feature adds a complete Reddit-style community system to the KAKSHA Smart Classroom application, allowing students and professors to create posts, comment, vote, and engage in class-based discussions.

## Features Implemented

### 🏛️ Database Schema
- **CommunityPosts**: Stores all posts with voting counts and metadata
- **CommunityComments**: Threaded comments system with parent-child relationships
- **CommunityVotes**: Individual vote tracking to prevent duplicate voting

### 🔐 Authentication & Authorization
- Integrated with existing JWT authentication
- Role-based access (student/professor)
- Protected routes requiring valid tokens

### 📝 Post Management
- Create posts with title and content
- Class-based filtering (students see their class, professors see their teaching classes)
- Voting system (upvote/downvote) similar to Reddit
- Post metadata (author, timestamps, vote counts)

### 💬 Comment System
- Threaded comments with unlimited nesting
- Reply to comments functionality
- Vote tracking for comments
- Author identification (student/professor badges)

### 🎨 User Interface
- Clean, modern design matching existing app theme
- Responsive layout for mobile and desktop
- Real-time vote count updates
- Loading states and error handling

## API Endpoints

### Student Routes (`/api/v1/student/community/`)
- `GET /init` - Initialize community tables
- `GET /posts` - Get posts with optional class filter
- `POST /posts` - Create new post
- `GET /posts/:postId` - Get post with comments
- `POST /posts/:postId/comments` - Create comment
- `POST /vote/:targetId` - Vote on post/comment
- `GET /votes` - Get user's current votes

### Professor Routes (`/api/v1/professor/community/`)
- Same endpoints as student routes but with professor context

## File Structure

### Backend
```
Backend/
├── models/CommunityModel.js          # Database operations
├── controller/CommunityController.js  # Request handling & validation
└── routes/                           # Updated with community routes
    ├── studentRoutes.js
    └── professorRoutes.js
```

### Frontend
```
Frontend/app/
├── components/
│   ├── CommunityPostCard.tsx         # Individual post display
│   ├── CreatePostForm.tsx            # Post creation form
│   └── CommentSection.tsx            # Comments display & management
├── student/community/
│   ├── page.tsx                      # Main community page
│   └── post/[postId]/page.tsx        # Post detail page
└── professor/community/
    ├── page.tsx                      # Main community page
    └── post/[postId]/page.tsx        # Post detail page
```

## Usage

### For Students
1. Navigate to "Community" in the sidebar
2. View posts from your class
3. Create new posts using the "Create Post" button
4. Vote on posts and comments
5. Click on posts to view full discussion
6. Reply to comments in threaded conversations

### For Professors
1. Navigate to "Community" in the sidebar
2. Filter posts by class you teach
3. Create posts for class discussions
4. Moderate conversations through voting
5. Engage with students in threaded discussions

## Technical Details

### Database Tables
- **CommunityPosts**: id, title, content, author_id, author_type, class_id, upvotes, downvotes, timestamps
- **CommunityComments**: id, post_id, content, author_id, author_type, parent_comment_id, upvotes, downvotes, timestamps  
- **CommunityVotes**: id, user_id, user_type, target_id, target_type, vote_type, timestamp

### Key Features
- **Threaded Comments**: Parent-child relationships allow nested discussions
- **Vote System**: Prevents duplicate voting, tracks individual votes
- **Class-based Communities**: Automatic filtering by user's class assignments
- **Real-time Updates**: Vote counts update immediately after voting
- **Responsive Design**: Works on mobile and desktop devices

## Future Enhancements
- Image uploads for posts
- Post categories/tags
- User reputation system
- Moderation tools for professors
- Email notifications for replies
- Search functionality
- Advanced filtering options

## Setup Instructions
1. Backend automatically initializes tables on first community access
2. No additional configuration required
3. Feature integrates with existing authentication system
4. Compatible with current PostgreSQL database setup

The community feature is now fully functional and ready for use by students and professors in the KAKSHA Smart Classroom system.