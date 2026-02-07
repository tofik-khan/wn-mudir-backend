require("dotenv").config();
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";
import { createUpdatePayload } from "../../utils/payload";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECTION}/`,
);

export const getAdmins = async (req, res) => {
  try {
    await client.connect();

    const admins = await client
      .db("mudir")
      .collection("admins")
      .find({})
      .toArray();
    res.send({ status: "success", data: admins });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const createAdmin = async (req, res) => {
  try {
    await client.connect();
    const result = await client
      .db("mudir")
      .collection("admins")
      .insertOne(req.body);
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const updateAdmin = async (req, res) => {
  try {
    await client.connect();
    const _id =
      typeof req.body._id === "string"
        ? new ObjectId(req.body._id)
        : req.body._id;
    delete req.body._id;
    delete req.body.index;
    const existing = await client
      .db("mudir")
      .collection("admins")
      .findOne({ _id });
    const result = await client
      .db("mudir")
      .collection("admins")
      .updateOne({ _id }, { $set: createUpdatePayload(existing, req.body) });
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const updateAdminImage = async (req, res) => {
  try {
    await client.connect();

    const adminUpdated = await client
      .db("mudir")
      .collection("admins")
      .updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { image: req.body.image } },
      );
    res.send({ status: "success", data: adminUpdated });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const updateAdminLastLogin = async (req, res) => {
  try {
    await client.connect();

    const adminUpdated = await client
      .db("mudir")
      .collection("admins")
      .updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { lastLogin: dayjs().format() } },
      );
    res.send({ status: "success", data: adminUpdated });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};
