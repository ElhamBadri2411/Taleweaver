import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
//Need this import or it dies
import User from "./models/user.js";
import { StoryBook } from "./models/storybook.js";
import { Page } from "./models/page.js";
import { generateImage } from "./controllers/images_controller.js";
import db from "./utils/db.js";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await db.authenticate();
  await db.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const generateStoryPrompt = (title, description) => {
  return `
Create a 7-page outline for a children's story titled '${title}' with the description '${description}' Each page should include a brief description of the events and an image description suitable for DALL-E image generation. Avoid using specific character names in the image descriptions. Describe each page thoroughly and ensure the image descriptions have a "storybook/kid" theme. Make sure each image description is self-contained and does not rely on previous context.

Format the response as:
'Page n\\nParagraph: [content]\\nImage Prompt: [image description]'

Here is an example of the output format:

Page 1
Paragraph: Once upon a time, there was a bright red car that loved adventures. One sunny morning, the car set off on a journey to explore new places, starting with a nearby forest filled with towering trees and chirping birds.
Image Prompt: A bright red car with big, friendly eyes driving through a colorful, lush green forest with tall, whimsical trees and happy birds flying above. The scene is illustrated in a storybook style with soft, rounded edges and vibrant colors.

Page 2
Paragraph: The car drove through the forest and soon arrived at a vast desert. The golden sands stretched as far as the eye could see, with the sun shining brightly in the sky.
Image Prompt: A bright red car with big, friendly eyes driving through a vibrant, golden desert with soft dunes and a smiling sun overhead. The scene is illustrated in a playful, storybook style with warm colors and gentle lines.

Now, generate the 7-page outline based on the provided description and format. Ensure that the image descriptions have a "storybook/kid" theme, are fully self-contained, and do not use specific character names.
`;
};

const generatePageContent = async (job) => {
  const { storyId, title, description } = job.data;

  try {
    const story = await StoryBook.findByPk(storyId);
    if (!story) throw new Error("Story not found");

    // Generate story outline
    const outlineResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a children's story writer." },
        { role: "user", content: `${generateStoryPrompt(title, description)}` },
      ],
    });

    const outline = outlineResponse.choices[0].message.content.split("\nPage ");
    console.log(outline);

    for (let i = 0; i < outline.length; i++) {
      const pageContent = outline[i].split("\n");
      const paragraph = pageContent
        .find((line) => line.startsWith("Paragraph:"))
        .replace("Paragraph: ", "")
        .trim();
      const imagePrompt = pageContent
        .find((line) => line.startsWith("Image Prompt:"))
        .replace("Image Prompt: ", "")
        .trim();

      const page = await Page.create({
        paragraph,
        position: i,
        StoryBookId: storyId,
      });

      await generateImage(
        { body: { text: imagePrompt, pageId: page.id } },
        null,
        () => {},
      );
      const progress = Math.floor((i / (outline.length - 1)) * 100);
      await job.updateProgress(progress);
    }

    await StoryBook.update({ isGenerating: false }, { where: { id: storyId } });
  } catch (error) {
    console.error("Error in story generation:", error);
    await StoryBook.update({ isGenerating: false }, { where: { id: storyId } });
  }
};

export { generatePageContent };
