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
import { createProject, getProjects } from "./waqfeardhi/projects";

const app = express();
app.use(express.json());
app.use(cors());

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "RS256",
});

app.get("/", checkJwt, (req, res) => res.send("Express on Vercel"));

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

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
