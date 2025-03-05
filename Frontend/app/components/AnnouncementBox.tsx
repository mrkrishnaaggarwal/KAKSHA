"use client";

import React, { useState, useRef, FormEvent } from 'react';
import {
    Box,
    Card,
    Avatar,
    TextField,
    Button,
    Typography,
    Divider,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Collapse,
    Fade
} from '@mui/material';
import {
    AttachFile,
    Close,
    Send,
    Image,
    InsertDriveFile,
    YouTube,
    Link as LinkIcon
} from '@mui/icons-material';

type PostType = 'announcement' | 'homework';
type AttachmentType = 'file' | 'image' | 'youtube' | 'link';

interface Attachment {
    id: string;
    name: string;
    type: AttachmentType;
    url?: string;
    file?: File;
}

interface PostProps {
    classId: string;
    teacher: {
        name: string;
        avatar: string;
    };
    actionUrl: string;
}

const AnnouncementBox: React.FC<PostProps> = ({ classId, teacher, actionUrl }) => {
    // States
    const [isExpanded, setIsExpanded] = useState(false);
    const [postType, setPostType] = useState<PostType>('announcement');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [dueDate, setDueDate] = useState<string>('');
    const [dueTime, setDueTime] = useState<string>('');
    const [points, setPoints] = useState<number>(100);
    const [topic, setTopic] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // File upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
    const [attachmentType, setAttachmentType] = useState<AttachmentType>('file');
    const [linkUrl, setLinkUrl] = useState('');

    // Functions
    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
        setContent('');
        setAttachments([]);
        setPostType('announcement');
        setDueDate('');
        setDueTime('');
        setPoints(100);
        setTopic('');
    };

    const handlePostTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostType(event.target.value as PostType);
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFile = event.target.files[0];
            const newAttachment: Attachment = {
                id: Date.now().toString(),
                name: newFile.name,
                type: 'file',
                file: newFile
            };
            setAttachments([...attachments, newAttachment]);
        }
    };

    const handleAddAttachment = () => {
        setAttachmentDialogOpen(true);
    };

    const handleAttachmentDialogClose = () => {
        setAttachmentDialogOpen(false);
        setAttachmentType('file');
        setLinkUrl('');
    };

    const handleAttachmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttachmentType(event.target.value as AttachmentType);
    };

    const handleAddLink = () => {
        if (linkUrl.trim()) {
            const newAttachment: Attachment = {
                id: Date.now().toString(),
                name: linkUrl,
                type: attachmentType,
                url: linkUrl
            };
            setAttachments([...attachments, newAttachment]);
            handleAttachmentDialogClose();
        }
    };

    const handleRemoveAttachment = (id: string) => {
        setAttachments(attachments.filter(att => att.id !== id));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('classId', classId);
            formData.append('type', postType);
            formData.append('content', content);

            if (postType === 'homework') {
                formData.append('dueDate', dueDate);
                formData.append('dueTime', dueTime);
                formData.append('points', points.toString());
                formData.append('topic', topic);
            }

            // Add attachments
            attachments.forEach((attachment, index) => {
                formData.append(`attachmentType_${index}`, attachment.type);
                formData.append(`attachmentName_${index}`, attachment.name);

                if (attachment.file) {
                    formData.append(`attachmentFile_${index}`, attachment.file);
                } else if (attachment.url) {
                    formData.append(`attachmentUrl_${index}`, attachment.url);
                }
            });

            // Submit the form data to the server
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                handleClose();
            } else {
                // Handle error
                console.error('Failed to post announcement');
            }
        } catch (error) {
            console.error('Error posting announcement:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Attachment Icon based on type
    const getAttachmentIcon = (type: AttachmentType) => {
        switch (type) {
            case 'image': return <Image color="primary" />;
            case 'youtube': return <YouTube sx={{ color: '#FF0000' }} />;
            case 'link': return <LinkIcon color="secondary" />;
            default: return <InsertDriveFile color="info" />;
        }
    };

    // Get attachment color based on type
    const getAttachmentColor = (type: AttachmentType) => {
        switch (type) {
            case 'image': return 'primary.50';
            case 'youtube': return '#FEE2E2';
            case 'link': return 'secondary.50';
            default: return 'info.50';
        }
    };

    return (
        <>
            <Card 
                sx={{ 
                    mb: 4, 
                    maxWidth: '450px',  // Change this value to adjust width
                    width: '100%', 
                    mx: 'auto',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                }}
            >
                {!isExpanded ? (
                    <Box 
                        sx={{ 
                            p: 3, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: '#fafafa'
                            },
                            transition: 'background-color 0.2s ease'
                        }}
                        onClick={handleExpand}
                    >
                        <Avatar 
                            src={teacher.avatar} 
                            alt={teacher.name}
                            sx={{ 
                                width: 48, 
                                height: 48,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }} 
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Announce something to your class..."
                            onClick={handleExpand}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '24px',
                                    bgcolor: '#f1f3f4',
                                    fontSize: '1rem',
                                    py: 0.5,
                                    px: 1,
                                    '&:hover': {
                                        bgcolor: '#e8eaed'
                                    },
                                    '& fieldset': {
                                        border: 'none'
                                    }
                                },
                                '&::placeholder': {
                                    opacity: 0.7
                                }
                            }}
                        />
                    </Box>
                ) : (
                    <Fade in={isExpanded}>
                        <form ref={formRef} onSubmit={handleSubmit}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    mb: 3 
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar 
                                            src={teacher.avatar} 
                                            alt={teacher.name} 
                                            sx={{ 
                                                width: 48, 
                                                height: 48,
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Box>
                                            <Typography 
                                                variant="subtitle1" 
                                                fontWeight="600"
                                                color="text.primary"
                                            >
                                                {teacher.name}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                            >
                                                Teacher
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton 
                                        onClick={handleClose} 
                                        type="button"
                                        sx={{ 
                                            color: 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                color: 'text.primary'
                                            }
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    placeholder="Share something with your class..."
                                    value={content}
                                    onChange={handleContentChange}
                                    name="content"
                                    sx={{ 
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                                borderWidth: '2px'
                                            }
                                        }
                                    }}
                                />

                                {/* Attachments preview */}
                                {attachments.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight="500" 
                                            sx={{ mb: 1.5, color: 'text.secondary' }}
                                        >
                                            Attachments ({attachments.length})
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                            {attachments.map(attachment => (
                                                <Paper
                                                    key={attachment.id}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 1.5,
                                                        borderRadius: '8px',
                                                        bgcolor: getAttachmentColor(attachment.type),
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        justifyContent: 'space-between',
                                                        minWidth: '180px',
                                                        maxWidth: '300px'
                                                    }}
                                                    elevation={0}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        {getAttachmentIcon(attachment.type)}
                                                        <Typography 
                                                            variant="body2" 
                                                            noWrap 
                                                            sx={{ 
                                                                maxWidth: '200px',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {attachment.name}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveAttachment(attachment.id)}
                                                        type="button"
                                                        sx={{ 
                                                            ml: 1,
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0,0,0,0.08)',
                                                                color: 'error.main'
                                                            }
                                                        }}
                                                    >
                                                        <Close fontSize="small" />
                                                    </IconButton>
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Post type selector */}
                                <Box sx={{ 
                                    mb: 3,
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="text.secondary"
                                        sx={{ mb: 1, fontWeight: 500 }}
                                    >
                                        Post type
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={postType}
                                        onChange={handlePostTypeChange}
                                        name="postType"
                                    >
                                        <FormControlLabel
                                            value="announcement"
                                            control={<Radio sx={{ '&.Mui-checked': { color: '#1a73e8' } }} />}
                                            label={
                                                <Typography sx={{ fontWeight: postType === 'announcement' ? 500 : 400 }}>
                                                    Announcement
                                                </Typography>
                                            }
                                        />
                                        <FormControlLabel
                                            value="homework"
                                            control={<Radio sx={{ '&.Mui-checked': { color: '#673ab7' } }} />} // Purple color for radio
                                            label={
                                                <Typography sx={{ fontWeight: postType === 'homework' ? 500 : 400 }}>
                                                    Homework
                                                </Typography>
                                            }
                                        />
                                    </RadioGroup>
                                </Box>

                                {/* Homework specific fields */}
                                <Collapse in={postType === 'homework'}>
                                    <Box sx={{ 
                                        mb: 3, 
                                        p: 2.5,
                                        bgcolor: 'rgba(103, 58, 183, 0.05)', // Light purple background
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: 'rgba(103, 58, 183, 0.2)' // Light purple border
                                    }}>
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ mb: 2, fontWeight: 600, color: '#673ab7' }} // Purple text
                                        >
                                            Assignment Details
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                                            <TextField
                                                label="Due Date"
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                size="small"
                                                sx={{ 
                                                    minWidth: '180px',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px'
                                                    }
                                                }}
                                                name="dueDate"
                                            />
                                            <TextField
                                                label="Due Time"
                                                type="time"
                                                value={dueTime}
                                                onChange={(e) => setDueTime(e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                size="small"
                                                sx={{ 
                                                    minWidth: '180px',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px'
                                                    }
                                                }}
                                                name="dueTime"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            <TextField
                                                label="Points"
                                                type="number"
                                                value={points}
                                                onChange={(e) => setPoints(Number(e.target.value))}
                                                size="small"
                                                sx={{ 
                                                    width: '120px',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px'
                                                    }
                                                }}
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                                name="points"
                                            />
                                            <FormControl 
                                                size="small" 
                                                sx={{ 
                                                    minWidth: '180px',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px'
                                                    }
                                                }}
                                            >
                                                <InputLabel>Topic</InputLabel>
                                                <Select
                                                    value={topic}
                                                    label="Topic"
                                                    onChange={(e) => setTopic(e.target.value)}
                                                    name="topic"
                                                >
                                                    <MenuItem value="">None</MenuItem>
                                                    <MenuItem value="Chapter 1">Chapter 1</MenuItem>
                                                    <MenuItem value="Chapter 2">Chapter 2</MenuItem>
                                                    <MenuItem value="Project">Project</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Collapse>

                                <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <IconButton 
                                            onClick={handleAddAttachment} 
                                            type="button"
                                            color="primary"
                                            sx={{ 
                                                bgcolor: 'primary.50',
                                                '&:hover': {
                                                    bgcolor: 'primary.100',
                                                }
                                            }}
                                        >
                                            <AttachFile />
                                        </IconButton>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                alignSelf: 'center', 
                                                color: 'text.secondary',
                                                ml: 1
                                            }}
                                        >
                                            Add attachment
                                        </Typography>
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color={postType === 'announcement' ? 'primary' : 'success'}
                                        disabled={!content.trim() || isSubmitting}
                                        endIcon={<Send />}
                                        sx={{ 
                                            borderRadius: '28px', 
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1,
                                            fontWeight: 500,
                                            boxShadow: 2,
                                            '&:hover': {
                                                boxShadow: 4
                                            }
                                        }}
                                    >
                                        {postType === 'announcement' ? 'Post' : 'Assign'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Fade>
                )}
            </Card>

            {/* Attachment Dialog */}
            <Dialog 
                open={attachmentDialogOpen} 
                onClose={handleAttachmentDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    Add Attachment
                </DialogTitle>
                <DialogContent sx={{ mt: 2, p: 3 }}>
                    <RadioGroup
                        value={attachmentType}
                        onChange={handleAttachmentTypeChange}
                        sx={{ mb: 3 }}
                    >
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 2 
                        }}>
                            <FormControlLabel 
                                value="file" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InsertDriveFile color="info" />
                                        <Typography fontWeight={attachmentType === 'file' ? 500 : 400}>
                                            Upload File
                                        </Typography>
                                    </Box>
                                }
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: attachmentType === 'file' ? 'info.main' : 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    bgcolor: attachmentType === 'file' ? 'info.50' : 'transparent'
                                }}
                            />
                            <FormControlLabel 
                                value="image" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Image color="primary" />
                                        <Typography fontWeight={attachmentType === 'image' ? 500 : 400}>
                                            Image
                                        </Typography>
                                    </Box>
                                }
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: attachmentType === 'image' ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    bgcolor: attachmentType === 'image' ? 'primary.50' : 'transparent'
                                }}
                            />
                            <FormControlLabel 
                                value="youtube" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <YouTube sx={{ color: '#FF0000' }} />
                                        <Typography fontWeight={attachmentType === 'youtube' ? 500 : 400}>
                                            YouTube
                                        </Typography>
                                    </Box>
                                }
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: attachmentType === 'youtube' ? '#FF0000' : 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    bgcolor: attachmentType === 'youtube' ? '#FEE2E2' : 'transparent'
                                }}
                            />
                            <FormControlLabel 
                                value="link" 
                                control={<Radio />} 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinkIcon color="secondary" />
                                        <Typography fontWeight={attachmentType === 'link' ? 500 : 400}>
                                            Link
                                        </Typography>
                                    </Box>
                                }
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: attachmentType === 'link' ? 'secondary.main' : 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    bgcolor: attachmentType === 'link' ? 'secondary.50' : 'transparent'
                                }}
                            />
                        </Box>
                    </RadioGroup>

                    <Box sx={{ mt: 4 }}>
                        {attachmentType === 'file' ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => fileInputRef.current?.click()}
                                startIcon={<AttachFile />}
                                fullWidth
                                sx={{ 
                                    py: 1.5, 
                                    borderRadius: '8px',
                                    borderWidth: '2px',
                                    borderStyle: 'dashed',
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Choose File
                            </Button>
                        ) : (
                            <TextField
                                fullWidth
                                label={
                                    attachmentType === 'image' ? 'Image URL' :
                                        attachmentType === 'youtube' ? 'YouTube URL' : 'URL'
                                }
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {getAttachmentIcon(attachmentType)}
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px'
                                    }
                                }}
                                placeholder={
                                    attachmentType === 'image' ? 'https://example.com/image.jpg' :
                                    attachmentType === 'youtube' ? 'https://youtu.be/example' : 
                                    'https://example.com'
                                }
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                        onClick={handleAttachmentDialogClose}
                        sx={{ 
                            color: 'text.secondary',
                            px: 3
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={attachmentType === 'file' ? handleAttachmentDialogClose : handleAddLink}
                        color="primary"
                        variant="contained"
                        disabled={attachmentType !== 'file' && !linkUrl.trim()}
                        sx={{ 
                            borderRadius: '20px',
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        {attachmentType === 'file' ? 'Close' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AnnouncementBox;