import pg from 'pg';
import dotenv from 'dotenv';
import apiResponse from '../utils/apiResponse.js';

dotenv.config();
const { Pool } = pg;

class CommunityModel {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
    }

    // Create the community tables if they don't exist
    async initializeTables() {
        const client = await this.pool.connect();
        
        try {
            // Create Posts table
            await client.query(`
                CREATE TABLE IF NOT EXISTS "CommunityPosts" (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT,
                    author_id INTEGER NOT NULL,
                    author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('student', 'professor')),
                    class_id INTEGER,
                    upvotes INTEGER DEFAULT 0,
                    downvotes INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_pinned BOOLEAN DEFAULT FALSE,
                    is_deleted BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (class_id) REFERENCES "Class"(id)
                );
            `);

            // Create Comments table
            await client.query(`
                CREATE TABLE IF NOT EXISTS "CommunityComments" (
                    id SERIAL PRIMARY KEY,
                    post_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    author_id INTEGER NOT NULL,
                    author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('student', 'professor')),
                    parent_comment_id INTEGER,
                    upvotes INTEGER DEFAULT 0,
                    downvotes INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_deleted BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (post_id) REFERENCES "CommunityPosts"(id) ON DELETE CASCADE,
                    FOREIGN KEY (parent_comment_id) REFERENCES "CommunityComments"(id) ON DELETE CASCADE
                );
            `);

            // Create Votes table to track individual votes
            await client.query(`
                CREATE TABLE IF NOT EXISTS "CommunityVotes" (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'professor')),
                    target_id INTEGER NOT NULL,
                    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
                    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, user_type, target_id, target_type)
                );
            `);

            // Create indexes for better performance
            await client.query(`
                CREATE INDEX IF NOT EXISTS idx_community_posts_class_id ON "CommunityPosts"(class_id);
                CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON "CommunityPosts"(created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON "CommunityComments"(post_id);
                CREATE INDEX IF NOT EXISTS idx_community_votes_target ON "CommunityVotes"(target_id, target_type);
            `);

            console.log('[CommunityModel] Tables initialized successfully');
            return new apiResponse(200, null, "Community tables initialized successfully");
        } catch (error) {
            console.error('[CommunityModel] Error initializing tables:', error);
            return new apiResponse(500, null, "Error initializing community tables");
        } finally {
            client.release();
        }
    }

    // Create a new post
    async createPost(postData) {
        console.log('\n[CommunityModel] Creating new post:', {
            title: postData.title,
            authorId: postData.authorId,
            authorType: postData.authorType,
            classId: postData.classId,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();
        
        try {
            const query = `
                INSERT INTO "CommunityPosts" 
                (title, content, author_id, author_type, class_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`;
            
            const values = [
                postData.title,
                postData.content,
                postData.authorId,
                postData.authorType,
                postData.classId
            ];
            
            const result = await client.query(query, values);
            
            console.log('[CommunityModel] Post created successfully with ID:', result.rows[0].id);
            
            return new apiResponse(201, result.rows[0], "Post created successfully");
        } catch (error) {
            console.error('[CommunityModel] Error creating post:', error);
            return new apiResponse(500, null, "Error creating post");
        } finally {
            client.release();
        }
    }

    // Get posts with author info and vote counts
    async getPosts(classId = null, limit = 20, offset = 0) {
        console.log('\n[CommunityModel] Fetching posts:', {
            classId,
            limit,
            offset,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();
        
        try {
            let query = `
                SELECT 
                    p.*,
                    CASE 
                        WHEN p.author_type = 'student' THEN s.first_name || ' ' || s.last_name
                        WHEN p.author_type = 'professor' THEN prof.first_name || ' ' || prof.last_name
                    END as author_name,
                    CASE 
                        WHEN p.author_type = 'student' THEN s.roll_no
                        ELSE NULL
                    END as author_roll_no,
                    c.name as class_name,
                    (SELECT COUNT(*) FROM "CommunityComments" WHERE post_id = p.id AND is_deleted = FALSE) as comment_count
                FROM "CommunityPosts" p
                LEFT JOIN "Student" s ON p.author_type = 'student' AND p.author_id = s.id
                LEFT JOIN "Professor" prof ON p.author_type = 'professor' AND p.author_id = prof.id
                LEFT JOIN "Class" c ON p.class_id = c.id
                WHERE p.is_deleted = FALSE`;

            const values = [];
            let paramIndex = 1;

            if (classId) {
                query += ` AND p.class_id = $${paramIndex}`;
                values.push(classId);
                paramIndex++;
            }

            query += ` ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            values.push(limit, offset);

            const result = await client.query(query, values);
            
            console.log(`[CommunityModel] Found ${result.rows.length} posts`);
            
            return new apiResponse(200, result.rows, "Posts fetched successfully");
        } catch (error) {
            console.error('[CommunityModel] Error fetching posts:', error);
            return new apiResponse(500, null, "Error fetching posts");
        } finally {
            client.release();
        }
    }

    // Get a single post with comments
    async getPostWithComments(postId) {
        console.log('\n[CommunityModel] Fetching post with comments:', {
            postId,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();
        
        try {
            // Get post details
            const postQuery = `
                SELECT 
                    p.*,
                    CASE 
                        WHEN p.author_type = 'student' THEN s.first_name || ' ' || s.last_name
                        WHEN p.author_type = 'professor' THEN prof.first_name || ' ' || prof.last_name
                    END as author_name,
                    CASE 
                        WHEN p.author_type = 'student' THEN s.roll_no
                        ELSE NULL
                    END as author_roll_no,
                    c.name as class_name
                FROM "CommunityPosts" p
                LEFT JOIN "Student" s ON p.author_type = 'student' AND p.author_id = s.id
                LEFT JOIN "Professor" prof ON p.author_type = 'professor' AND p.author_id = prof.id
                LEFT JOIN "Class" c ON p.class_id = c.id
                WHERE p.id = $1 AND p.is_deleted = FALSE`;

            const postResult = await client.query(postQuery, [postId]);
            
            if (postResult.rows.length === 0) {
                return new apiResponse(404, null, "Post not found");
            }

            // Get comments
            const commentsQuery = `
                SELECT 
                    c.*,
                    CASE 
                        WHEN c.author_type = 'student' THEN s.first_name || ' ' || s.last_name
                        WHEN c.author_type = 'professor' THEN prof.first_name || ' ' || prof.last_name
                    END as author_name,
                    CASE 
                        WHEN c.author_type = 'student' THEN s.roll_no
                        ELSE NULL
                    END as author_roll_no
                FROM "CommunityComments" c
                LEFT JOIN "Student" s ON c.author_type = 'student' AND c.author_id = s.id
                LEFT JOIN "Professor" prof ON c.author_type = 'professor' AND c.author_id = prof.id
                WHERE c.post_id = $1 AND c.is_deleted = FALSE
                ORDER BY c.created_at ASC`;

            const commentsResult = await client.query(commentsQuery, [postId]);

            const post = postResult.rows[0];
            post.comments = commentsResult.rows;

            console.log(`[CommunityModel] Found post with ${commentsResult.rows.length} comments`);
            
            return new apiResponse(200, post, "Post with comments fetched successfully");
        } catch (error) {
            console.error('[CommunityModel] Error fetching post with comments:', error);
            return new apiResponse(500, null, "Error fetching post");
        } finally {
            client.release();
        }
    }

    // Create a comment
    async createComment(commentData) {
        console.log('\n[CommunityModel] Creating new comment:', {
            postId: commentData.postId,
            authorId: commentData.authorId,
            authorType: commentData.authorType,
            parentCommentId: commentData.parentCommentId,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();
        
        try {
            const query = `
                INSERT INTO "CommunityComments" 
                (post_id, content, author_id, author_type, parent_comment_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`;
            
            const values = [
                commentData.postId,
                commentData.content,
                commentData.authorId,
                commentData.authorType,
                commentData.parentCommentId || null
            ];
            
            const result = await client.query(query, values);
            
            console.log('[CommunityModel] Comment created successfully with ID:', result.rows[0].id);
            
            return new apiResponse(201, result.rows[0], "Comment created successfully");
        } catch (error) {
            console.error('[CommunityModel] Error creating comment:', error);
            return new apiResponse(500, null, "Error creating comment");
        } finally {
            client.release();
        }
    }

    // Vote on a post or comment
    async vote(voteData) {
        console.log('\n[CommunityModel] Processing vote:', {
            userId: voteData.userId,
            userType: voteData.userType,
            targetId: voteData.targetId,
            targetType: voteData.targetType,
            voteType: voteData.voteType,
            timestamp: new Date().toISOString()
        });

        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // Check if user has already voted
            const existingVoteQuery = `
                SELECT * FROM "CommunityVotes" 
                WHERE user_id = $1 AND user_type = $2 AND target_id = $3 AND target_type = $4`;
            
            const existingVote = await client.query(existingVoteQuery, [
                voteData.userId, voteData.userType, voteData.targetId, voteData.targetType
            ]);

            let voteAction = '';

            if (existingVote.rows.length > 0) {
                const currentVote = existingVote.rows[0];
                
                if (currentVote.vote_type === voteData.voteType) {
                    // Remove vote if clicking same vote type
                    await client.query(`
                        DELETE FROM "CommunityVotes" 
                        WHERE user_id = $1 AND user_type = $2 AND target_id = $3 AND target_type = $4`,
                        [voteData.userId, voteData.userType, voteData.targetId, voteData.targetType]
                    );
                    voteAction = 'removed';
                } else {
                    // Update vote type
                    await client.query(`
                        UPDATE "CommunityVotes" 
                        SET vote_type = $5, created_at = CURRENT_TIMESTAMP
                        WHERE user_id = $1 AND user_type = $2 AND target_id = $3 AND target_type = $4`,
                        [voteData.userId, voteData.userType, voteData.targetId, voteData.targetType, voteData.voteType]
                    );
                    voteAction = 'updated';
                }
            } else {
                // Create new vote
                await client.query(`
                    INSERT INTO "CommunityVotes" (user_id, user_type, target_id, target_type, vote_type)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [voteData.userId, voteData.userType, voteData.targetId, voteData.targetType, voteData.voteType]
                );
                voteAction = 'created';
            }

            // Update vote counts in target table
            const tableName = voteData.targetType === 'post' ? '"CommunityPosts"' : '"CommunityComments"';
            
            const voteCountsQuery = `
                SELECT 
                    COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as upvotes,
                    COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as downvotes
                FROM "CommunityVotes" 
                WHERE target_id = $1 AND target_type = $2`;
            
            const voteCounts = await client.query(voteCountsQuery, [voteData.targetId, voteData.targetType]);
            
            await client.query(`
                UPDATE ${tableName} 
                SET upvotes = $2, downvotes = $3 
                WHERE id = $1`,
                [voteData.targetId, voteCounts.rows[0].upvotes, voteCounts.rows[0].downvotes]
            );

            await client.query('COMMIT');
            
            console.log(`[CommunityModel] Vote ${voteAction} successfully`);
            
            return new apiResponse(200, {
                action: voteAction,
                upvotes: parseInt(voteCounts.rows[0].upvotes),
                downvotes: parseInt(voteCounts.rows[0].downvotes)
            }, `Vote ${voteAction} successfully`);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[CommunityModel] Error processing vote:', error);
            return new apiResponse(500, null, "Error processing vote");
        } finally {
            client.release();
        }
    }
}

export default CommunityModel;