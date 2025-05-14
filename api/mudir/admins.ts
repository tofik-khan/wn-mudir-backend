require("dotenv").config();
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/`
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

export const updateAdminImage = async (req, res) => {
  try {
    await client.connect();

    const adminUpdated = await client
      .db("mudir")
      .collection("admins")
      .updateOne(
        { _id: new ObjectId(req.body._id) },
        { $set: { image: req.body.image } }
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
        { $set: { lastLogin: dayjs().format() } }
      );
    res.send({ status: "success", data: adminUpdated });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};