import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

type ArtworkStyle = "watercolor" | "pencil" | "oil" | "crayon";

interface GenerateArtworkRequest {
  emotion?: string;
  intensity?: number;
  dialogue?: string[];
  style?: ArtworkStyle;
}

const allowedStyles = new Set<ArtworkStyle>(["watercolor", "pencil", "oil", "crayon"]);

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function buildArtworkPrompt({
  emotion,
  intensity,
  dialogue,
  style,
}: Required<GenerateArtworkRequest>) {
  const dialogueSummary = dialogue.length > 0 ? dialogue.join(" ") : "No dialogue provided.";

  return [
    "Create a poetic square artwork for a life gallery app.",
    `Emotion: ${emotion}.`,
    `Intensity: ${intensity}/100.`,
    `Conversation notes: ${dialogueSummary}`,
    `Visual style: ${style}.`,
    "Avoid text, captions, logos, watermarks, or UI elements in the image.",
    "The image should feel intimate, warm, reflective, and suitable for a personal gallery wall.",
  ].join(" ");
}

function normalizeIntensity(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 50;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeStyle(value: unknown): ArtworkStyle {
  return typeof value === "string" && allowedStyles.has(value as ArtworkStyle)
    ? (value as ArtworkStyle)
    : "watercolor";
}

function createDescription(emotion: string, intensity: number, style: ArtworkStyle) {
  return `Artwork inspired by ${emotion}, rendered as ${style} with emotional intensity ${intensity}/100.`;
}

app.post("/api/generate-artwork", async (req, res) => {
  const body = req.body as GenerateArtworkRequest;
  const emotion = body.emotion?.trim();

  if (!emotion) {
    return res.status(400).json({ error: "emotion is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  const intensity = normalizeIntensity(body.intensity);
  const dialogue = Array.isArray(body.dialogue) ? body.dialogue.filter((line) => typeof line === "string") : [];
  const style = normalizeStyle(body.style);
  const prompt = buildArtworkPrompt({ emotion, intensity, dialogue, style });

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = image.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(502).json({ error: "Image generation returned no image data" });
    }

    return res.json({
      title: `${emotion} moment`,
      description: createDescription(emotion, intensity, style),
      prompt,
      imageUrl: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("Artwork generation failed", error);
    return res.status(500).json({ error: "Failed to generate artwork" });
  }
});

app.listen(port, () => {
  console.log(`AI artwork server listening on http://localhost:${port}`);
});