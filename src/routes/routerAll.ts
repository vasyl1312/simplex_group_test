import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";
import * as doctorController from "../controllers/doctorController";
import * as appointmentController from "../controllers/appointmentController";

const router: Router = express.Router();

router.get("/users", userController.getAllUsers);
router.post("/users", userController.postUser);

router.get("/doctors", doctorController.getAllDoctors);
router.post("/doctors", doctorController.postDoctor);

router.get("/appointments", appointmentController.getAllAppointments);
router.post("/appointments", appointmentController.postAppointment);

export default router;
