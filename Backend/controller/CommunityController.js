import CommunityModel from '../models/CommunityModel.js';
import apiResponse from '../utils/apiResponse.js';
import Joi from 'joi';

class CommunityController {
    constructor() {
        this.communityModel = new CommunityModel();
        console.log('[CommunityController] Initialized');
    }

    // Initialize community tables
    async initializeTables(req, res) {
        console.log('\n[CommunityController] Initialize tables request');
        
        try {
            const response = await this.communityModel.initializeTables();
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Initialize tables error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Create a new post
    async createPost(req, res) {
        console.log('\n[CommunityController] Create post request:', {
            userId: req.user.id,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        try {
            // Validate request data
            const schema = Joi.object({
                title: Joi.string().min(3).max(255).required().messages({
                    'string.min': 'Title must be at least 3 characters long',
                    'string.max': 'Title cannot exceed 255 characters',
                    'any.required': 'Title is required'
                }),
                content: Joi.string().max(5000).allow('').messages({
                    'string.max': 'Content cannot exceed 5000 characters'
                }),
                classId: Joi.number().integer().positive().required().messages({
                    'number.base': 'Class ID must be a number',
                    'number.positive': 'Class ID must be positive',
                    'any.required': 'Class ID is required'
                }),
                authorType: Joi.string().valid('student', 'professor').required().messages({
                    'any.only': 'Author type must be either student or professor',
                    'any.required': 'Author type is required'
                })
            });

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                console.log('[CommunityController] Validation failed:', errorMessage);
                return res.status(400).json(new apiResponse(400, null, errorMessage));
            }

            const postData = {
                ...value,
                authorId: req.user.id
            };

            const response = await this.communityModel.createPost(postData);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Create post error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Get posts (with optional class filter)
    async getPosts(req, res) {
        console.log('\n[CommunityController] Get posts request:', {
            query: req.query,
            timestamp: new Date().toISOString()
        });

        try {
            const classId = req.query.classId ? parseInt(req.query.classId) : null;
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;

            // Validate parameters
            if (classId && (isNaN(classId) || classId <= 0)) {
                return res.status(400).json(new apiResponse(400, null, "Invalid class ID"));
            }

            if (limit > 100) {
                return res.status(400).json(new apiResponse(400, null, "Limit cannot exceed 100"));
            }

            const response = await this.communityModel.getPosts(classId, limit, offset);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Get posts error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Get a single post with comments
    async getPost(req, res) {
        console.log('\n[CommunityController] Get post request:', {
            postId: req.params.postId,
            timestamp: new Date().toISOString()
        });

        try {
            const postId = parseInt(req.params.postId);

            if (isNaN(postId) || postId <= 0) {
                return res.status(400).json(new apiResponse(400, null, "Invalid post ID"));
            }

            const response = await this.communityModel.getPostWithComments(postId);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Get post error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Create a comment
    async createComment(req, res) {
        console.log('\n[CommunityController] Create comment request:', {
            userId: req.user.id,
            postId: req.params.postId,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        try {
            const postId = parseInt(req.params.postId);

            if (isNaN(postId) || postId <= 0) {
                return res.status(400).json(new apiResponse(400, null, "Invalid post ID"));
            }

            // Validate request data
            const schema = Joi.object({
                content: Joi.string().min(1).max(2000).required().messages({
                    'string.min': 'Comment cannot be empty',
                    'string.max': 'Comment cannot exceed 2000 characters',
                    'any.required': 'Comment content is required'
                }),
                authorType: Joi.string().valid('student', 'professor').required().messages({
                    'any.only': 'Author type must be either student or professor',
                    'any.required': 'Author type is required'
                }),
                parentCommentId: Joi.number().integer().positive().optional().messages({
                    'number.base': 'Parent comment ID must be a number',
                    'number.positive': 'Parent comment ID must be positive'
                })
            });

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                console.log('[CommunityController] Validation failed:', errorMessage);
                return res.status(400).json(new apiResponse(400, null, errorMessage));
            }

            const commentData = {
                ...value,
                postId,
                authorId: req.user.id
            };

            const response = await this.communityModel.createComment(commentData);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Create comment error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Vote on a post or comment
    async vote(req, res) {
        console.log('\n[CommunityController] Vote request:', {
            userId: req.user.id,
            targetId: req.params.targetId,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        try {
            const targetId = parseInt(req.params.targetId);

            if (isNaN(targetId) || targetId <= 0) {
                return res.status(400).json(new apiResponse(400, null, "Invalid target ID"));
            }

            // Validate request data
            const schema = Joi.object({
                userType: Joi.string().valid('student', 'professor').required().messages({
                    'any.only': 'User type must be either student or professor',
                    'any.required': 'User type is required'
                }),
                targetType: Joi.string().valid('post', 'comment').required().messages({
                    'any.only': 'Target type must be either post or comment',
                    'any.required': 'Target type is required'
                }),
                voteType: Joi.string().valid('upvote', 'downvote').required().messages({
                    'any.only': 'Vote type must be either upvote or downvote',
                    'any.required': 'Vote type is required'
                })
            });

            const { error, value } = schema.validate(req.body);
            
            if (error) {
                const errorMessage = error.details.map(detail => detail.message).join(', ');
                console.log('[CommunityController] Validation failed:', errorMessage);
                return res.status(400).json(new apiResponse(400, null, errorMessage));
            }

            const voteData = {
                ...value,
                userId: req.user.id,
                targetId
            };

            const response = await this.communityModel.vote(voteData);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('[CommunityController] Vote error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }

    // Get user's vote status for multiple posts/comments
    async getUserVotes(req, res) {
        console.log('\n[CommunityController] Get user votes request:', {
            userId: req.user.id,
            query: req.query,
            timestamp: new Date().toISOString()
        });

        try {
            const { targetIds, targetType, userType } = req.query;

            if (!targetIds || !targetType || !userType) {
                return res.status(400).json(new apiResponse(400, null, "Missing required parameters"));
            }

            // Validate target type
            if (!['post', 'comment'].includes(targetType)) {
                return res.status(400).json(new apiResponse(400, null, "Invalid target type"));
            }

            // Validate user type
            if (!['student', 'professor'].includes(userType)) {
                return res.status(400).json(new apiResponse(400, null, "Invalid user type"));
            }

            // Parse target IDs
            const targetIdArray = targetIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

            if (targetIdArray.length === 0) {
                return res.status(400).json(new apiResponse(400, null, "No valid target IDs provided"));
            }

            // Get user votes from database
            const client = await this.communityModel.pool.connect();
            
            try {
                const query = `
                    SELECT target_id, vote_type 
                    FROM "CommunityVotes" 
                    WHERE user_id = $1 AND user_type = $2 AND target_type = $3 AND target_id = ANY($4)`;
                
                const result = await client.query(query, [req.user.id, userType, targetType, targetIdArray]);
                
                // Convert to object for easy lookup
                const votes = {};
                result.rows.forEach(row => {
                    votes[row.target_id] = row.vote_type;
                });

                return res.status(200).json(new apiResponse(200, votes, "User votes fetched successfully"));
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('[CommunityController] Get user votes error:', error);
            return res.status(500).json(new apiResponse(500, null, "Internal server error"));
        }
    }
}

export default CommunityController;