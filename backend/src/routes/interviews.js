"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const helpers_1 = require("../controllers/helpers");
const interviewsController_1 = require("../controllers/interviewsController");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_1.authMiddleware);
router.get('/', helpers_1.verifyApplicationOwnership, interviewsController_1.listInterviews);
router.post('/', helpers_1.verifyApplicationOwnership, [
    (0, express_validator_1.body)('roundType').isIn(Object.values(client_1.RoundType)).withMessage('Invalid round type'),
    (0, express_validator_1.body)('scheduledAt').isISO8601().withMessage('Valid scheduled date is required'),
], validation_1.validateRequest, interviewsController_1.createInterview);
exports.default = router;
