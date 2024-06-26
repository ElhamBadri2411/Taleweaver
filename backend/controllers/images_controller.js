import OpenAI from "openai";
import crypto from 'crypto'
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs"

const OPEN_API_KEY = process.env.OPEN_API_KEY

const openai = new OpenAI({ apiKey: OPEN_API_KEY })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// @route POST api/images/
// @desc Generate a new image 
// @access private
const generateImage = async (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required to generate image' });
  }

  try {
    const response = await openai.images.generate({
      prompt: text,
      size: "512x512"
    })
    console.log(response);
    const imageUrl = response.data[0].url;

    // fetch image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });



    // Save the image to the local file system
    const imageHash = crypto.createHash('md5').update(imageResponse.data).digest('hex');
    const fileName = `${imageHash}.png`;
    const imagePath = path.join(__dirname, '..', 'generated-images', fileName);
    fs.writeFileSync(imagePath, imageResponse.data);

    res.json({ imagePath: `generated-images/${fileName}` });
  } catch (error) {
    console.error('Error generating or saving image:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate or save image' });
  }
}


export {
  generateImage,
  __dirname
}
