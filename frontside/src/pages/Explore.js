import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Grid,
    TextField,
    Typography,
    Avatar,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Button
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    PersonAdd as PersonAddIcon
} from '@material-ui/icons';

const Explore = () => {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
    // eslint-disable-next-line no-unused-vars
    const currentUser = useSelector(state => state.auth.user);
    
    useEffect(() => {
        fetchTrendingPosts();
        fetchSuggestedUsers();
    }, []);
    
    const fetchTrendingPosts = async () => {
        try {
            const res = await axios.get('/api/explore/trending');
            setTrendingPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const fetchSuggestedUsers = async () => {
        try {
            const res = await axios.get('/api/explore/suggested-users');
            setSuggestedUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/api/explore/search?q=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const followUser = async (userId) => {
        try {
            await axios.post(`/api/users/follow/${userId}`);
            // Update UI
            setSuggestedUsers(suggestedUsers.filter(user => user._id !== userId));
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div style={{ padding: '20px' }}>
            {/* Search Bar */}
            <form onSubmit={handleSearch}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users and posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" />
                    }}
                    style={{ marginBottom: '20px' }}
                />
            </form>
            
            {/* Display search results if any */}
            {searchQuery && (
                <>
                    <Typography variant="h6" gutterBottom>Search Results</Typography>
                    
                    {searchResults.users.length > 0 && (
                        <>
                            <Typography variant="subtitle1">Users</Typography>
                            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                                {searchResults.users.map(user => (
                                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                                        <Card>
                                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={user.profilePicture} style={{ marginRight: '10px' }} />
                                                <div>
                                                    <Typography variant="subtitle1">{user.username}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{user.fullName}</Typography>
                                                </div>
                                                <Button 
                                                    startIcon={<PersonAddIcon />} 
                                                    style={{ marginLeft: 'auto' }}
                                                    onClick={() => followUser(user._id)}
                                                >
                                                    Follow
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    
                    {searchResults.posts.length > 0 && (
                        <>
                            <Typography variant="subtitle1">Posts</Typography>
                            <Grid container spacing={2}>
                                {searchResults.posts.map(post => (
                                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                                        <PostCard post={post} />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    
                    {searchResults.users.length === 0 && searchResults.posts.length === 0 && (
                        <Typography>No results found</Typography>
                    )}
                </>
            )}
            
            {/* Default Explore Content when not searching */}
            {!searchQuery && (
                <>
                    {/* Suggested Users */}
                    <Typography variant="h6" gutterBottom>Suggested Users</Typography>
                    <Grid container spacing={2} style={{ marginBottom: '30px' }}>
                        {suggestedUsers.map(user => (
                            <Grid item xs={12} sm={6} md={4} key={user._id}>
                                <Card>
                                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={user.profilePicture} style={{ marginRight: '10px' }} />
                                        <div>
                                            <Typography variant="subtitle1">{user.username}</Typography>
                                            <Typography variant="body2" color="textSecondary">{user.fullName}</Typography>
                                        </div>
                                        <Button 
                                            startIcon={<PersonAddIcon />} 
                                            style={{ marginLeft: 'auto' }}
                                            onClick={() => followUser(user._id)}
                                        >
                                            Follow
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    {/* Trending Posts */}
                    <Typography variant="h6" gutterBottom>Trending Posts</Typography>
                    <Grid container spacing={2}>
                        {trendingPosts.map(post => (
                            <Grid item xs={12} sm={6} md={4} key={post._id}>
                                <PostCard post={post} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
};

// Reusable Post Card Component
const PostCard = ({ post }) => {
    return (
        <Card>
            <CardMedia
                component="img"
                height="300"
                image={post.image}
                alt={post.caption}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    @{post.user.username}
                </Typography>
                <Typography variant="body1" style={{ marginTop: '5px' }}>
                    {post.caption}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="like">
                    <FavoriteIcon />
                    <Typography style={{ marginLeft: '5px' }}>
                        {post.likes.length}
                    </Typography>
                </IconButton>
                <IconButton aria-label="comment">
                    <CommentIcon />
                    <Typography style={{ marginLeft: '5px' }}>
                        {post.comments.length}
                    </Typography>
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default Explore;