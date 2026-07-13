"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyApplicationOwnership = void 0;
const prisma_1 = require("../lib/prisma");
const verifyApplicationOwnership = async (req, res, next) => {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const application = await prisma_1.prisma.application.findFirst({
        where: { id: applicationId, userId },
    });
    if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
    }
    next();
};
exports.verifyApplicationOwnership = verifyApplicationOwnership;
