"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const applicationsController_1 = require("../controllers/applicationsController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', applicationsController_1.listApplications);
router.post('/', [
    (0, express_validator_1.body)('company').notEmpty().withMessage('Company is required'),
    (0, express_validator_1.body)('role').notEmpty().withMessage('Role is required'),
    (0, express_validator_1.body)('status').isIn(Object.values(client_1.ApplicationStatus)).withMessage('Invalid status'),
], validation_1.validateRequest, applicationsController_1.createApplication);
router.get('/:id', applicationsController_1.getApplication);
router.put('/:id', [
    (0, express_validator_1.body)('status').optional().isIn(Object.values(client_1.ApplicationStatus)).withMessage('Invalid status'),
    (0, express_validator_1.body)('job.company').optional().notEmpty().withMessage('Company cannot be empty'),
    (0, express_validator_1.body)('job.role').optional().notEmpty().withMessage('Role cannot be empty'),
], validation_1.validateRequest, applicationsController_1.updateApplication);
router.delete('/:id', applicationsController_1.deleteApplication);
exports.default = router;
