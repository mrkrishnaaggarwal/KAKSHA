import Joi from "joi";
import ExcelJS from "exceljs";
import apiResponse from "../utils/apiResponse.js";
import ProfessorModel from "../models/professorModel.js";
import StudentModel from "../models/studentModel.js";
import ResultModel from "../models/resultModel.js";
import HomeWorkModel from "../models/HomeWorkModel.js";
class ProfessorService {
  constructor() {
    this.professorModel = new ProfessorModel();
    this.studentModel = new StudentModel();
    this.resultModel = new ResultModel();
    this.homeWorkModel = new HomeWorkModel();
    console.log("[ProfessorService] Initialized with Professor Model");
  }

  validateLoginData(data) {
    console.log("\n[ProfessorService] Starting login validation:", {
      email: data.email,
      timestamp: new Date().toISOString(),
    });

    const schema = Joi.object({
      email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
    });

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      console.log("[ProfessorService] Validation failed:", {
        errors: errorMessage,
        timestamp: new Date().toISOString(),
      });
      return new apiResponse(400, null, errorMessage);
    }

    console.log("[ProfessorService] Validation successful");
    return null;
  }

  validateHomeworkData(data) {
    console.log("\n[ProfessorService] Validating homework data");

    const schema = Joi.object({
      title: Joi.string().required().messages({
        "any.required": "Title is required",
      }),
      content: Joi.string().required().messages({
        "any.required": "Content is required",
      }),
      classId: Joi.number().required().messages({
        "any.required": "Class ID is required",
      }),
      submissionDate: Joi.date().greater("now").required().messages({
        "any.required": "Submission date is required",
        "date.greater": "Submission date must be in the future",
      }),
      totalMarks: Joi.number().integer().min(1).default(100),
      // Add file fields to schema validation
      fileName: Joi.string().allow("").allow(null),
      fileLink: Joi.string().uri().allow("").allow(null).messages({
        "string.uri": "File link must be a valid URL",
      }),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      console.log("[ProfessorService] Validation failed:", {
        errors: errorMessage,
        timestamp: new Date().toISOString(),
      });
      return { error: new apiResponse(400, null, errorMessage) };
    }

    console.log("[ProfessorService] Homework data validation successful");
    return { value };
  }
  async createHomework(professorId, homeworkData) {
    console.log("\n[ProfessorService] Creating homework assignment:", {
      professorId,
      title: homeworkData.title,
      fileName: homeworkData.fileName || "None",
      timestamp: new Date().toISOString(),
    });

    try {
      // Validate the homework data
      const { error, value } = this.validateHomeworkData(homeworkData);
      if (error) return error;

      // Prepare the homework data with professor ID
      const homeworkToCreate = {
        ...value,
        professorId,
        publishDate: new Date(),
      };

      console.log("[ProfessorService] Calling model createHomework method");
      const response = await this.homeWorkModel.createHomework(
        homeworkToCreate
      );

      console.log("[ProfessorService] Model response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("[ProfessorService] createHomework Error:", error);
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }
  async getProfessorClasses(professorId) {
    console.log("\n[ProfessorService] Getting classes for professor:", {
      professorId,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log(
        "[ProfessorService] Calling model getProfessorClasses method"
      );
      const response = await this.homeWorkModel.getProfessorClasses(
        professorId
      );

      console.log("[ProfessorService] Model response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("[ProfessorService] getProfessorClasses Error:", error);
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }

  async getProfessorHomework(professorId) {
    console.log(
      "\n[ProfessorService] Getting homework assignments for professor:",
      {
        professorId,
        timestamp: new Date().toISOString(),
      }
    );

    try {
      console.log(
        "[ProfessorService] Calling model getProfessorHomework method"
      );
      const response = await this.homeWorkModel.getProfessorHomework(
        professorId
      );

      console.log("[ProfessorService] Model response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("[ProfessorService] getProfessorHomework Error:", error);
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }

  async login(loginData) {
    console.log("\n[ProfessorService] Login attempt:", {
      email: loginData.email,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("[ProfessorService] Validating login data...");
      const validationError = this.validateLoginData(loginData);
      if (validationError) {
        console.log("[ProfessorService] Validation error detected");
        return validationError;
      }

      console.log("[ProfessorService] Calling model login method");
      const response = await this.professorModel.login(
        loginData.email,
        loginData.password
      );

      console.log("[ProfessorService] Model response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("[ProfessorService] Login error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }

  async refresh(token) {
    console.log("\n[ProfessorService] Token refresh attempt:", {
      tokenExists: !!token,
      timestamp: new Date().toISOString(),
    });

    try {
      if (!token) {
        console.log("[ProfessorService] No refresh token provided");
        return new apiResponse(403, null, "No refresh token provided");
      }

      console.log("[ProfessorService] Calling model refresh method");
      const response = await ProfessorModel.refresh(token);

      console.log("[ProfessorService] Refresh complete:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("[ProfessorService] Refresh error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }

  async validateExcelFormat(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    const requiredColumns = [
      "student_id",
      "exam",
      "subject",
      "date",
      "marks",
      "total_marks",
      "semester",
    ];

    // Get the header row (row 1) values
    const headers = worksheet.getRow(1).values.slice(1); // Remove the first null value

    // Ensure all required columns are present
    const isValidFormat = requiredColumns.every((col) => headers.includes(col));
    if (!isValidFormat) {
      throw new Error("Invalid Excel format. Required headers are missing.");
    }

    // Map column names to their indexes
    const columnIndexes = requiredColumns.reduce((acc, col) => {
      acc[col] = headers.indexOf(col) + 1; // Get the index (1-based)
      return acc;
    }, {});

    const results = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      results.push({
        studentId: row.getCell(columnIndexes["student_id"]).value?.toString(),
        exam: row.getCell(columnIndexes["exam"]).value?.toString(),
        subject: row.getCell(columnIndexes["subject"]).value?.toString(),
        date: new Date(row.getCell(columnIndexes["date"]).value),
        marks: parseInt(row.getCell(columnIndexes["marks"]).value),
        totalMarks: parseInt(row.getCell(columnIndexes["total_marks"]).value),
        semester: parseInt(row.getCell(columnIndexes["semester"]).value),
      });
    });

    return results;
  }
  async validateExcelFormat(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    const requiredColumns = [
      "roll_number",
      "exam",
      "subject",
      "date",
      "marks",
      "total_marks",
      "semester",
    ];

    // Get the header row (row 1) values
    const headers = worksheet.getRow(1).values.slice(1); // Remove the first null value

    // Ensure all required columns are present
    const isValidFormat = requiredColumns.every((col) => headers.includes(col));
    if (!isValidFormat) {
      throw new Error("Invalid Excel format. Required headers are missing.");
    }

    // Map column names to their indexes
    const columnIndexes = requiredColumns.reduce((acc, col) => {
      acc[col] = headers.indexOf(col) + 1; // Get the index (1-based)
      return acc;
    }, {});

    const results = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      results.push({
        roll_number: row
          .getCell(columnIndexes["roll_number"])
          .value?.toString(),
        exam: row.getCell(columnIndexes["exam"]).value?.toString(),
        subject: row.getCell(columnIndexes["subject"]).value?.toString(),
        date: new Date(row.getCell(columnIndexes["date"]).value),
        marks: parseInt(row.getCell(columnIndexes["marks"]).value),
        totalMarks: parseInt(row.getCell(columnIndexes["total_marks"]).value),
        semester: parseInt(row.getCell(columnIndexes["semester"]).value),
      });
    });

    return results;
  }

  async uploadResults(file) {
    console.log("[ProfessorService] Uploading results");
    try {
      console.log("[ProfessorService] Calling model uploadResults method");
      let results = await this.validateExcelFormat(file);
      console.log("[ProfessorService] Results validated:", results);
      results = await this.studentModel.processResults(results);
      const response = await this.resultModel.uploadResults(results);
      console.log("[ProfessorService] Model response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error("[ProfessorService] uploadResults Error:", error);
      return new apiResponse(500, null, error.message);
    }
  }
  validateProfileData(data) {
    console.log("\n[ProfessorService] Validating profile update data");

    const schema = Joi.object({
      firstName: Joi.string().min(2).max(100).messages({
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 100 characters",
      }),
      lastName: Joi.string().min(2).max(100).messages({
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 100 characters",
      }),
      address: Joi.string().allow("", null),
    });

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      console.log("[ProfessorService] Validation failed:", {
        errors: errorMessage,
        timestamp: new Date().toISOString(),
      });
      return new apiResponse(400, null, errorMessage);
    }

    console.log("[ProfessorService] Validation successful");
    return null;
  }

  async getProfile(professorId) {
    console.log("\n[ProfessorService] Getting professor profile:", {
      professorId,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await this.professorModel.getProfile(professorId);
      return response;
    } catch (error) {
      console.error("[ProfessorService] Get profile error:", error);
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }

  async updateProfile(professorId, profileData) {
    console.log("\n[ProfessorService] Updating professor profile:", {
      professorId,
      timestamp: new Date().toISOString(),
    });

    try {
      const validationError = this.validateProfileData(profileData);
      if (validationError) return validationError;

      const response = await this.professorModel.updateProfile(
        professorId,
        profileData
      );
      return response;
    } catch (error) {
      console.error("[ProfessorService] Update profile error:", error);
      return new apiResponse(500, null, "An internal server error occurred");
    }
  }
}

export default ProfessorService;
