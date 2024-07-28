import axios from "axios";
import fs from "fs";
import util from "util";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const apiKey = process.env.GOOGLE_TEXT_TO_SPEECH_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateAudio = async (req, res, next) => {
  const { text, bookId } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Text is required to generate audio" });
  }

  try {
    const requestBody = {
      input: { text: text },
      voice: { languageCode: "en-US", name: "en-US-Wavenet-F" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      requestBody,
    );

    const audioDir = path.join(__dirname, "..", "generated-audio");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    const audioPath = path.join(audioDir, bookId + "-output.mp3");
    await writeFile(
      audioPath,
      Buffer.from(response.data.audioContent, "base64"),
    );

    res.status(200).json({ audioPath: audioPath });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate or save audio" });
  }
};

// Check if audio file exists
const checkAudio = async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }
  const fileName = bookId + "-output.mp3";
  const filePath = path.join(__dirname, "..", "generated-audio", fileName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(200).json({ exists: false });
    }
    res.json({ exists: true });
  });
};

// Delete audio file
const deleteAudio = async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }
  const fileName = bookId + "-output.mp3";
  const filePath = path.join(__dirname, "..", "generated-audio", fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting file" });
    }
    res.status(200).json({ message: "File deleted" });
  });
};

export { generateAudio, checkAudio, deleteAudio };
