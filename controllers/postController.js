'use strict';
const postModel = require('../models/postModel');
const thumb = require('../utils/resize');

// get all posts
const get_all_post = async (req, res) => {
    const posts = await postModel.getAllPosts([req.params.search]);
    await res.json(posts);
};

// get one post
const get_post = async (req, res) => {
    const post = await postModel.getPost([req.params.id]);
    await res.json(post);
};

// add a new post
const add_post = async (req, res) => {
    try {
        await thumb.makeThumbnail(
            req.file.path,
            'thumbnails/' + req.file.filename,
            {width: 300, height: 300}
        );
    } catch (e) {
        console.log('sharp error: ', e);
    }
    const params = [
        req.user.user_id,
        req.body.post_title,
        req.body.post_text,
        req.file.filename,
    ];
    const response = await postModel.addPost(params);
    await res.json(response);
};

// get liked posts by user
const get_liked = async (req, res) => {
    const response = await postModel.getLikedPosts([req.user.user_id]);
    await res.json(response);
};

// add a comment to a post
const add_comment = async (req, res) => {
    const params = [
        req.user.user_id,
        req.body.post_id,
        req.body.comment
    ];
    const response = await  postModel.addComment(params);
    await res.json(response);
};

// add a vote for a post
const vote = async (req, res) => {
  const params = [
      req.user.user_id,
      req.body.post_id,
      1
  ];
  const response = await postModel.vote(params);
  await res.json(response);
};

// delete a post
const delete_post = async (req, res) => {
    if (req.user.user_role === 1) {
        const params = [req.params.id];
        const response = await postModel.deletePost(params);
        await  res.json(response);
    } else {
        res.send('Unauthorized access');
    }

};

module.exports = {
    get_all_post,
    get_post,
    add_post,
    get_liked,
    add_comment,
    vote,
    delete_post,
};