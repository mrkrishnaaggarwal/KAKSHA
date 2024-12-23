"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StudentController {
    // Get student profile
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming middleware sets user
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const student = yield prisma.student.findUnique({
                    where: {
                        id: userId
                    },
                    include: {
                        class: {
                            select: {
                                name: true,
                                class_teacher: true
                            }
                        }
                    }
                });
                if (!student) {
                    return res.status(404).json({ error: 'Student not found' });
                }
                const { password } = student, studentData = __rest(student, ["password"]);
                return res.json(studentData);
            }
            catch (error) {
                console.error('Profile fetch error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // Update student profile
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const updateData = req.body;
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                const student = yield prisma.student.update({
                    where: {
                        id: userId
                    },
                    data: updateData
                });
                const { password } = student, updatedStudentData = __rest(student, ["password"]);
                return res.json(updatedStudentData);
            }
            catch (error) {
                console.error('Profile update error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // Update profile photo
    static updateProfilePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const photoBuffer = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
                if (!userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                if (!photoBuffer) {
                    return res.status(400).json({ error: 'No photo provided' });
                }
                yield prisma.student.update({
                    where: {
                        id: userId
                    },
                    data: {
                        photo: photoBuffer
                    }
                });
                return res.json({ message: 'Profile photo updated successfully' });
            }
            catch (error) {
                console.error('Photo upload error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.StudentController = StudentController;
