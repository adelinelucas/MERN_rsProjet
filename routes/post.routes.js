const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

// gestion du crud pour les posts
router.get('/', postController.readPost);
router.post('/' , upload.single('file'), postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// gestion des likes
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// commentaire des posts
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-post/:id', postController.deleteCommentPost)

module.exports = router;