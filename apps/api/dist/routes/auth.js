"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Authentication routes
router.post('/signup', auth_1.signup);
router.post('/login', auth_1.login);
router.get('/me', auth_2.authenticate, auth_1.me);
exports.default = router;
