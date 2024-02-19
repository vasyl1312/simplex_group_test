import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

import connect from "../db/dbConnect";
import { newUserSchema, TNewUser } from "../db/schema/users";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const db = await connect();

    const users = await db.select().from(newUserSchema).execute();

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const { phone, email, name } = req.body;
    const db = await connect();

    const existingUserEmail = await db
      .select()
      .from(newUserSchema)
      .where(eq(newUserSchema.email, email))
      .execute();

    if (existingUserEmail.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUser: TNewUser = {
      id: uuidv4(),
      phone,
      email,
      name,
    };

    await db.insert(newUserSchema).values(newUser).execute();

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
