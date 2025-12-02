const bcrypt = require("bcrypt");
const { prisma } = require("../config/db.js");

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, currentPassword, newPassword } = req.body;

        // Build update data object
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) {
            // Check if phone is already taken by another user
            const existingUser = await prisma.user.findFirst({
                where: {
                    phone,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                return res.status(400).json({ message: "Phone number already in use" });
            }
            updateData.phone = phone;
        }

        // Handle password update
        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const match = await bcrypt.compare(currentPassword, user.password);

            if (!match) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProfile, updateProfile };
