import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import connect from "../db/dbConnect";
import { newDoctorSchema, TNewDoctor } from "../db/schema/doctors";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const db = await connect();

    const doctors = await db.select().from(newDoctorSchema).execute();

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const postDoctor = async (req: Request, res: Response) => {
  try {
    const { email, name, spec, slots } = req.body;
    const db = await connect();

    const existingDoctorEmail = await db
      .select()
      .from(newDoctorSchema)
      .where(eq(newDoctorSchema.email, email))
      .execute();

    if (existingDoctorEmail.length > 0) {
      return res.status(400).json({ error: "Doctor with this email already exists" });
    }

    const newDoctor: TNewDoctor = {
      id: uuidv4(),
      email,
      name,
      spec,
      slots
    };

    await db.insert(newDoctorSchema).values(newDoctor).execute();

    return res.status(201).json({ doctor: newDoctor });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
