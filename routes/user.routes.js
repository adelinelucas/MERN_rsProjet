import express from 'express';

import  * as authController from '../controllers/auth.controller.js';
import * as userController from '../controllers/user.controller.js';
import * as uploadController from '../controllers/upload.controller.js';
import multer from 'multer';
const upload = multer();
const router = express.Router()
// authentification
router.post("/register",  authController.signUp);
router.post("/login",  authController.signIn);
router.get("/logout",  authController.logout);

//user DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// upload
router.post('/upload', upload.single('file'), uploadController.uploadProfil)

export default router;