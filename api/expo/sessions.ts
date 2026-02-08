require("dotenv").config();

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECTION}/`,
);

export const getSessions = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("expo")
      .collection("sessions")
      .find({})
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getOneSession = async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;

    const result = await client
      .db("expo")
      .collection("sessions")
      .find({ _id: new ObjectId(id) })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("expo")
      .collection("sessions")
      .insertOne({
        ...req.body,
        createdAt: dayjs().tz("America/New_York").format(),
      });
    res.send({ status: "success", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;

    if (!!req.body._id) delete req.body._id;

    const result = await client
      .db("expo")
      .collection("sessions")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};
