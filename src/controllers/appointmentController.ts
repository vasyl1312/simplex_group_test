import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import connect from "../db/dbConnect";
import { newAppointmentSchema, TAppointment } from "../db/schema/appointments";
import { newDoctorSchema } from "../db/schema/doctors";

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const db = await connect();

    const doctors = await db.select().from(newAppointmentSchema).execute();

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const postAppointment = async (req: Request, res: Response) => {
  try {
    const { user_id, doctor_id, slot } = req.body;
    const db = await connect();

    const doctor = await db
      .select()
      .from(newDoctorSchema)
      .where(eq(newDoctorSchema.id, doctor_id))
      .execute();

    if (doctor.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // get existing doctor's slots
    let existingSlots = doctor[0].slots || [];

    // check if slots exist
    if (!existingSlots.includes(slot)) {
      return res.status(400).json({ error: "Slot not available" });
    }

    // delete slot from doctors array
    existingSlots = existingSlots.filter((s: string) => s !== slot);

    await db
      .update(newDoctorSchema)
      .set({ slots: existingSlots })
      .where(eq(newDoctorSchema.id, doctor_id))
      .execute();

    const appointment: TAppointment = {
      id: uuidv4(),
      user_id,
      doctor_id,
      slot,
    };

    await db.insert(newAppointmentSchema).values(appointment).execute();

    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
