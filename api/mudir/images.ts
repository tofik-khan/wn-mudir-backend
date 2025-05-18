require("dotenv").config();
import ImageKit from "imagekit";

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

export const imageKitGetAssets = (req, res) => {
  try {
    imageKit.listFiles(
      {
        searchQuery: `path:"${req.query.folder}"`,
      },
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send({ status: "error", message: error });
        } else {
          res.send({ status: "success", data: result });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};
