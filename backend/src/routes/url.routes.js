import { Router } from "express";
import generateCode from "../utils/generateCode.js";
import urlModel from "../models/url.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "Please enter a url",
    });
  }

  if (
    url.startsWith("http://") == false &&
    url.startsWith("https://") == false
  ) {
    return res.status(400).json({
      message: "Please enter a valid URL starting with http:// or https://",
    });
  }

  if (url.length > 2048) {
    return res.status(400).json({ message: "url is too long" });
  }

  const code = generateCode();

  const newUrl = await urlModel.create({
    originalUrl: url,
    shortCode: code,
  });

  return res.status(201).json({
    message: "url shortened successfully",
    data: {
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
    },
  });
});

router.get("/", async (req, res) => {
  const urls = await urlModel.find().sort({ createdAt: -1 });

  return res.status(200).json({
    message: "URL fetched successfully",
    data: {
      urls,
    },
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedUrl = await urlModel.findByIdAndDelete(id);

  if (!deletedUrl) {
    return res.status(404).json({
      message: "URL not found",
    });
  }

  return res.status(200).json({
    message: "URL deleted successfully",
    data: deletedUrl,
  });
});

export default router;
