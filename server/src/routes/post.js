const express = require('express');
const postControllers = require('../controllers/post');
const { verifyToken } = require('../middlewares/verifyToken')

const router = express.Router();

router.get('/all', postControllers.getPosts)
router.get('/limit', postControllers.getPostsLimit)
router.get('/new-post', postControllers.getNewPosts)

router.use(verifyToken)
router.post('/create-new', postControllers.createNewPost)
router.get('/limit-admin', postControllers.getPostsLimitAdmin)
router.put('/update', postControllers.updatePost)
router.delete('/delete', postControllers.deletePost)

module.exports = router;