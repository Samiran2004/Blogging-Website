const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const userRouter = require('./router/userRouter');
const blogRouter = require('./router/blogRouter');
const cookieParser = require('cookie-parser');
const { validateTokenForUserAuthentication } = require('./middleware/userAuthenticationMiddleware');
const Blog = require('./models/blogModel');
const path = require('path')

const DB_URI = process.env.DATABASE_URL;
mongoose.connect(DB_URI).then(() => {
    console.log("Database connected.");
}).catch((err) => {
    console.log(`Database server error: ${err}`);
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(validateTokenForUserAuthentication("token"));
app.use(express.static(path.resolve('./public')))

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('homePage', {
        user: req.user,
        allBlogs
    });
})

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server error.");
    } else {
        console.log(`Server created on port: ${PORT}`);
    }
})