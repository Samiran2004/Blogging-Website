const express = require('express');
const Blog = require('../models/blogModel');
const multer = require('multer');
const path = require('path');
const Comment = require('../models/commentModel')
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage })

router.get('/addblog', (req, res) => {
    res.render('addNewBlog', {
        user: req.user
    });
});

router.post('/upload', upload.single("coverImage"), async (req, res) => {
    const { title, blogBody } = req.body;
    const result = await Blog.create({
        title: title,
        body: blogBody,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    });
    res.redirect(`/`);
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    res.render('viewBlog', {
        user: req.user,
        blog,
        comments
    });
});

router.post('/comment/:blogId', async (req,res)=>{
    await Comment.create({
        comment: req.body.comment,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    res.redirect(`/`);
});

module.exports = router