import { StatusCodes } from "http-status-codes";
import ImageKit from "imagekit";
import logger from "../../utils/logger.js";

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No image file provided" });
    }
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    // Upload the file buffer to ImageKit
    const response = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: req.file.buffer, // upload the buffer
          fileName: `place-${Date.now()}-${req.file.originalname}`,
          folder: "/tripfy_places", // The folder in ImageKit
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    return res.status(StatusCodes.OK).json({
      msg: "Image uploaded successfully",
      url: response.url,
    });
  } catch (error) {
    logger.error("ImageKit upload error", { message: error.message });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to upload image to ImageKit",
      error: error.message,
    });
  }
};

export default uploadImage;
