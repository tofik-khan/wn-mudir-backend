require("dotenv").config();
import dayjs from "dayjs";
import { MongoClient, ObjectId } from "mongodb";
import { createUpdatePayload } from "../../utils/payload";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECTION}/`,
);

export const getProjects = async (req, res) => {
  try {
    await client.connect();

    const projects = await client
      .db("waqfeardhi")
      .collection("projects")
      .find({})
      .sort("sortOrder")
      .toArray();
    res.send({ status: "success", data: projects });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const createProject = async (req, res) => {
  try {
    await client.connect();

    // Get the current highest sortOrder
    const last = await client
      .db("waqfeardhi")
      .collection("projects")
      .find()
      .sort({ sortOrder: -1 })
      .limit(1)
      .toArray();

    const nextSortOrder = (last[0]?.sortOrder || 0) + 1;

    const result = await client
      .db("waqfeardhi")
      .collection("projects")
      .insertOne({
        ...req.body,
        createdAt: dayjs().format(),
        editedBy: req.body.createdBy,
        editedAt: dayjs().format(),
        sortOrder: nextSortOrder,
      });
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const updateProject = async (req, res) => {
  try {
    await client.connect();
    const _id =
      typeof req.body._id === "string"
        ? new ObjectId(req.body._id)
        : req.body._id;
    delete req.body._id;
    delete req.body.index;

    /** Set editedAt value */
    req.body.editedAt = dayjs().format();

    const existing = await client
      .db("waqfeardhi")
      .collection("projects")
      .findOne({ _id });
    const result = await client
      .db("waqfeardhi")
      .collection("projects")
      .updateOne({ _id }, { $set: createUpdatePayload(existing, req.body) });
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const updateProjectsSortOrder = async (req, res) => {
  try {
    await client.connect();

    const updatedRows = req.body;

    for (const item of updatedRows) {
      await client
        .db("waqfeardhi")
        .collection("projects")
        .updateOne(
          { _id: new ObjectId(item._id) },
          { $set: { sortOrder: item.sortOrder } },
        );
      console.log(
        `Updated project ${item._id} with sortOrder ${item.sortOrder}`,
      );
    }
    res.send({ status: "success", data: "Done" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};
