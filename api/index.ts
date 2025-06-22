require("dotenv").config();
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import {
  createAdmin,
  getAdmins,
  updateAdmin,
  updateAdminImage,
  updateAdminLastLogin,
} from "./mudir/admins";
import { imageKitAuth, imageKitGetAssets } from "./mudir/images";
import {
  createProject,
  getProjects,
  updateProject,
} from "./waqfeardhi/projects";
import {
  createApplicant,
  getApplicants,
  getOneApplicant,
  udpateApplicantStatus,
} from "./waqfeardhi/applicants";
import {
  getApplicationCount,
  getApplicationCountByStatus,
  getApplicationsByAuxiliary,
  getApplicationsByMonth,
  getCompletedApplicationsCount,
  getProjectCount,
} from "./waqfeardhi/dashboard";

const app = express();
app.use(express.json());
app.use(cors());

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});

app.get("/", (req, res) => res.send("Express on Vercel"));

// Mudir - Admins
app.get("/mudir/admins", getAdmins);
app.post("/mudir/admins", checkJwt, createAdmin);
app.put("/mudir/admins", checkJwt, updateAdmin);

app.put("/mudir/admins/image", updateAdminImage);
app.put("/mudir/admins/lastlogin", updateAdminLastLogin);

// Mudir - Images
app.get("/mudir/images/auth", imageKitAuth);
app.get("/mudir/images", imageKitGetAssets);

// Waqf-e-Ardhi - Projects
app.get("/waqfeardhi/projects", getProjects);
app.post("/waqfeardhi/projects", checkJwt, createProject);
app.put("/waqfeardhi/projects", checkJwt, updateProject);

// Waqf-e-Ardhi - Applicants
app.get("/waqfeardhi/applicants", checkJwt, getApplicants);
app.get("/waqfeardhi/applicants/:id", checkJwt, getOneApplicant);
app.post("/waqfeardhi/applicants", createApplicant);
app.put("/waqfeardhi/applicants/:id/status", checkJwt, udpateApplicantStatus);

// Waqf-e-Ardhi - Dashboard
app.get("/waqfeardhi/count/applications", getApplicationCount);
app.get(
  "/waqfeardhi/count/completedApplications",
  getCompletedApplicationsCount
);
app.get("/waqfeardhi/count/projects", getProjectCount);
app.get(
  "/waqfeardhi/count/applicationsByAuxiliary",
  getApplicationsByAuxiliary
);
app.get("/waqfeardhi/count/applicationsPerMonth", getApplicationsByMonth);
app.get("/waqfeardhi/count/status/:status", getApplicationCountByStatus);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
