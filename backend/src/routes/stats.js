"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const statsController_1 = require("../controllers/statsController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', statsController_1.getStats);
exports.default = router;
