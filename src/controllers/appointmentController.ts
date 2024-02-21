import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";
import * as cron from "node-cron";
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

const scheduleAppointment = async (doctor_id: string, user_id: string, slot: string) => {
  try {
    const db = await connect();

    const doctor = await db
      .select()
      .from(newDoctorSchema)
      .where(sql`${newDoctorSchema.id} = ${doctor_id}`)
      .execute();

    if (doctor.length === 0) {
      return { error: "Doctor not found" };
    }

    let existingSlots = doctor[0].slots || [];

    if (!existingSlots.includes(slot)) {
      return { error: "Slot not available" };
    }

    existingSlots = existingSlots.filter((s: string) => s !== slot);

    await db
      .update(newDoctorSchema)
      .set({ slots: existingSlots })
      .where(sql`${newDoctorSchema.id} = ${doctor_id}`)
      .execute();

    const appointment: TAppointment = {
      id: uuidv4(),
      user_id,
      doctor_id,
      slot,
    };

    await db.insert(newAppointmentSchema).values(appointment).execute();

    return { message: "Appointment booked successfully", appointment };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Internal Server Error" };
  }
};
const scheduleNotifications = async (appointment: TAppointment) => {
  try {
    const appointmentTime = new Date(`${appointment.slot} UTC`);

    const notificationDate = new Date(appointmentTime);
    const notificationDayBefore = new Date(appointmentTime);
    const notificationHoursBefore = new Date(appointmentTime);

    notificationDayBefore.setDate(notificationDayBefore.getDate() - 1);
    notificationHoursBefore.setHours(notificationHoursBefore.getHours() - 2);
    notificationDate.setHours(notificationDate.getHours() - 2);

    // Функція для надсилання повідомлення
    const sendMessage = (notificationDate: Date) => {
      console.log(`Sending message at ${notificationDate}`);
      // Додайте код для відправки повідомлення в зазначений час тут
    };

    // const scheduleMessage = (dateTime: string) => {
    const scheduleMessage = (dateTime: Date, date: Date) => {
      const cronExpression = getCronExpression(dateTime);
      // console.log(cronExpression);
      // console.log(dateTime);

      if (cronExpression) {
        cron.schedule(cronExpression, () => {
          sendMessage(date);
        });
      } else {
        console.error("Invalid date format");
      }
    };

    // Функція для отримання виразу cron з дати
    const getCronExpression = (dateTime: Date): string | null => {
      try {
        const minute = dateTime.getUTCMinutes();
        const hour = dateTime.getUTCHours();
        const day = dateTime.getUTCDate();
        const month = dateTime.getUTCMonth() + 1;

        return `${minute} ${hour} ${day} ${month} *`;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    };

    scheduleMessage(notificationDayBefore, notificationDate);
    scheduleMessage(notificationHoursBefore, notificationDate);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const postAppointment = async (req: Request, res: Response) => {
  try {
    const { user_id, doctor_id, slot } = req.body;
    const appointmentResult = await scheduleAppointment(doctor_id, user_id, slot);

    if (appointmentResult.error) {
      return res.status(400).json({ error: appointmentResult.error });
    }

    // Перевірка, чи є призначення визначеним
    if (appointmentResult.appointment) {
      await scheduleNotifications(appointmentResult.appointment);

      return res.status(201).json({ message: "Appointment booked successfully" });
    } else {
      return res.status(400).json({ error: "Failed to book appointment" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
