require("dotenv").config();
import { MongoClient } from "mongodb";
import ImageKit from "imagekit";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/`
);

const imageKit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
});

export const imageKitAuth = (req, res) => {
  try {
    const { token, expire, signature } = imageKit.getAuthenticationParameters();
    res.send({
      status: "success",
      data: {
        token,
        expire,
        signature,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  }
};
