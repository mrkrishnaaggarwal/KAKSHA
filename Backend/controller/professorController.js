import ProfessorService from "../services/professorServices.js";

class ProfessorController {
  constructor() {
    this.professorService = new ProfessorService();
    console.log("[ProfessorController] Initialized with Professor Service");
  }

  async createHomework(req, res) {
    console.log("\n[ProfessorController] Create Homework Request:", {
      body: {
        ...req.body,
        title: req.body.title,
        classId: req.body.classId,
        fileName: req.body.fileName || null,
        fileLink: req.body.fileLink || null,
      },
      timestamp: new Date().toISOString(),
    });

    try {
      const professorId = req.user.id; // From auth middleware
      console.log(
        "[ProfessorController] Calling service createHomework method"
      );

      // Pass the homework data with file information from request body
      const response = await this.professorService.createHomework(
        professorId,
        req.body
      );

      console.log("[ProfessorController] Service response:", {
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString(),
      });

      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] Create Homework Error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async getProfessorClasses(req, res) {
    console.log("\n[ProfessorController] Get Professor Classes Request");

    try {
      const professorId = req.user.id; // From auth middleware
      console.log(
        "[ProfessorController] Calling service getProfessorClasses method"
      );
      const response = await this.professorService.getProfessorClasses(
        professorId
      );

      console.log("[ProfessorController] Service response:", {
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString(),
      });

      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(
        "[ProfessorController] Get Professor Classes Error:",
        error
      );
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async getProfessorHomework(req, res) {
    console.log("\n[ProfessorController] Get Professor Homework Request");

    try {
      const professorId = req.user.id; // From auth middleware
      console.log(
        "[ProfessorController] Calling service getProfessorHomework method"
      );
      const response = await this.professorService.getProfessorHomework(
        professorId
      );

      console.log("[ProfessorController] Service response:", {
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString(),
      });

      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(
        "[ProfessorController] Get Professor Homework Error:",
        error
      );
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async login(req, res) {
    console.log("\n[ProfessorController] Login Request:", {
      body: { ...req.body, password: "***" },
      headers: req.headers,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("[ProfessorController] Calling service login method");
      const response = await this.professorService.login(req.body);

      console.log("[ProfessorController] Service response:", {
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString(),
      });

      if (response.success && response.data?.tokens) {
        console.log("[ProfessorController] Setting refresh token cookie");
        res.cookie("refreshToken", response.data.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      console.log("[ProfessorController] Sending response");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] Controller Error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async refresh(req, res) {
    console.log("\n[ProfessorController] Refresh Token Request:", {
      cookies: req.cookies,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log("[ProfessorController] Calling service refresh method");
      const response = await this.professorService.refresh(
        req.cookies.refreshToken
      );

      console.log("[ProfessorController] Service response:", {
        statusCode: response.statusCode,
        success: response.success,
        timestamp: new Date().toISOString(),
      });

      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] Refresh Token Error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }
  async uploadResults(req, res) {
    console.log("[ProfessorController] Uploading results");
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log("[ProfessorController] Calling service uploadResults method");
      const response = await this.professorService.uploadResults(req.file);
      console.log("[ProfessorController] Service response received:", {
        success: response.success,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      });
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] uploadResults Error:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }
  v;
  async getProfile(req, res) {
    console.log("\n[ProfessorController] Get Profile Request:", {
      professorId: req.user.id,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await this.professorService.getProfile(req.user.id);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] Get Profile Error:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async updateProfile(req, res) {
    console.log("\n[ProfessorController] Update Profile Request:", {
      professorId: req.user.id,
      body: req.body,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await this.professorService.updateProfile(
        req.user.id,
        req.body
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error("[ProfessorController] Update Profile Error:", error);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null,
      });
    }
  }

  async logout(req, res) {
    console.log("\n[ProfessorController] Logout Request:", {
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });

    try {
      // Clear the HTTP-only refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      
      console.log("[ProfessorController] Successfully cleared refresh token cookie");
      
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Logged out successfully",
        data: null
      });
    } catch (error) {
      console.error("[ProfessorController] Logout Error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred",
        data: null
      });
    }
  }
}

export default ProfessorController;
