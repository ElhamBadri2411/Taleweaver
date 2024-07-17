import OpenAI from "openai";
import crypto from 'crypto'
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs"
import { Page } from '../models/page.js'

const OPEN_API_KEY = process.env.OPEN_API_KEY

const openai = new OpenAI({ apiKey: OPEN_API_KEY })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @route POST api/images/
// @desc Generate a new image 
// @access private
const generateImage = async (req, res, next) => {
  const { text, pageId } = req.body;
  const imageData = {}
  if (!text) {
    return res.status(400).json({ error: 'Text is required to generate image' });
  }

  const setup = "Create an illustration that combines the whimsical elements of a storybook with the aesthetic of '80s anime. Use soft lines and a textured look, with a palette of gentle, muted colors, ensuring the composition is balanced and visually enchanting."

  try {

    const page = await Page.findByPk(pageId)

    if (!page) {
      return res.status(404).json({ error: 'page not found' })
    }

    imageData.prompt = text;

    const response = await openai.images.generate({
      prompt: setup + text,
      size: "512x512"
    })
    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      console.log("imageURL not received")
    }


    // fetch image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Save the image to the local file system
    const imageHash = crypto.createHash('md5').update(imageResponse.data).digest('hex');
    const fileName = `${imageHash}.png`;
    const imagePath = path.join(__dirname, '..', 'generated-images', fileName);


    fs.writeFileSync(imagePath, imageResponse.data);
    imageData.path = `generated-images/${fileName}`

    await page.update({
      image: imageData
    })

    if (res) {
      res.json({ imagePath: `generated-images/${fileName}` });
    }
  } catch (error) {
    console.error('Error generating or saving image:', error.response ? error.response.data : error.message);
    if (res) {
      res.status(500).json({ error: 'Failed to generate or save image' });
    }
  }
}


export {
  generateImage,
  __dirname
}
