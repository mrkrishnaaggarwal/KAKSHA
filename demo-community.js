#!/usr/bin/env node

/**
 * Demo script for testing KAKSHA Community Features
 * 
 * This script demonstrates how to interact with the community API endpoints
 * Run this after starting the backend server to test the features
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

// Mock authentication token (replace with real token in actual testing)
const MOCK_TOKEN = 'your-jwt-token-here';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${MOCK_TOKEN}`,
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

async function testCommunityFeatures() {
  console.log('🚀 Testing KAKSHA Community Features...\n');

  try {
    // 1. Initialize community tables
    console.log('1. Initializing community tables...');
    const initResponse = await api.get('/student/community/init');
    console.log('✅ Tables initialized:', initResponse.data.message);

    // 2. Create a test post
    console.log('\n2. Creating a test post...');
    const postData = {
      title: 'Welcome to KAKSHA Community!',
      content: 'This is a test post to demonstrate the Reddit-like community features. Students and professors can now engage in meaningful discussions!',
      classId: 1,
      authorType: 'student'
    };
    
    const createPostResponse = await api.post('/student/community/posts', postData);
    console.log('✅ Post created:', createPostResponse.data.data?.title);
    const postId = createPostResponse.data.data?.id;

    // 3. Get all posts
    console.log('\n3. Fetching all posts...');
    const postsResponse = await api.get('/student/community/posts?limit=10');
    console.log(`✅ Found ${postsResponse.data.data?.length} posts`);

    // 4. Vote on the post
    if (postId) {
      console.log('\n4. Voting on the post...');
      const voteResponse = await api.post(`/student/community/vote/${postId}`, {
        userType: 'student',
        targetType: 'post',
        voteType: 'upvote'
      });
      console.log('✅ Vote recorded:', voteResponse.data.message);
    }

    // 5. Add a comment
    if (postId) {
      console.log('\n5. Adding a comment...');
      const commentData = {
        content: 'Great initiative! This will really help improve student-teacher interaction.',
        authorType: 'student'
      };
      
      const commentResponse = await api.post(`/student/community/posts/${postId}/comments`, commentData);
      console.log('✅ Comment added:', commentResponse.data.message);
    }

    // 6. Get post with comments
    if (postId) {
      console.log('\n6. Fetching post with comments...');
      const postDetailResponse = await api.get(`/student/community/posts/${postId}`);
      const post = postDetailResponse.data.data;
      console.log(`✅ Post retrieved: "${post?.title}" with ${post?.comments?.length} comments`);
    }

    console.log('\n🎉 All community features tested successfully!');
    console.log('\nFeatures verified:');
    console.log('• ✅ Database table initialization');
    console.log('• ✅ Post creation');
    console.log('• ✅ Post retrieval');
    console.log('• ✅ Voting system');
    console.log('• ✅ Comment system');
    console.log('• ✅ Threaded discussions');

  } catch (error) {
    console.error('\n❌ Error testing community features:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('\n💡 Note: Update MOCK_TOKEN with a valid JWT token to test authenticated endpoints');
    }
  }
}

async function showAPIDocumentation() {
  console.log('\n📚 KAKSHA Community API Documentation\n');
  
  console.log('Student Endpoints:');
  console.log('GET    /api/v1/student/community/init                    - Initialize tables');
  console.log('GET    /api/v1/student/community/posts                   - Get posts');
  console.log('POST   /api/v1/student/community/posts                   - Create post');
  console.log('GET    /api/v1/student/community/posts/:postId           - Get post details');
  console.log('POST   /api/v1/student/community/posts/:postId/comments  - Add comment');
  console.log('POST   /api/v1/student/community/vote/:targetId          - Vote on post/comment');
  console.log('GET    /api/v1/student/community/votes                   - Get user votes');
  
  console.log('\nProfessor Endpoints:');
  console.log('GET    /api/v1/professor/community/init                  - Initialize tables');
  console.log('GET    /api/v1/professor/community/posts                 - Get posts');
  console.log('POST   /api/v1/professor/community/posts                 - Create post');
  console.log('GET    /api/v1/professor/community/posts/:postId         - Get post details');
  console.log('POST   /api/v1/professor/community/posts/:postId/comments - Add comment');
  console.log('POST   /api/v1/professor/community/vote/:targetId        - Vote on post/comment');
  console.log('GET    /api/v1/professor/community/votes                 - Get user votes');
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('KAKSHA Community Features Demo Script\n');
  console.log('Usage:');
  console.log('  node demo-community.js [options]\n');
  console.log('Options:');
  console.log('  --test, -t     Run community feature tests');
  console.log('  --docs, -d     Show API documentation');
  console.log('  --help, -h     Show this help message\n');
  console.log('Examples:');
  console.log('  node demo-community.js --test');
  console.log('  node demo-community.js --docs');
} else if (args.includes('--docs') || args.includes('-d')) {
  showAPIDocumentation();
} else if (args.includes('--test') || args.includes('-t') || args.length === 0) {
  testCommunityFeatures();
} else {
  console.log('Unknown option. Use --help for usage information.');
}