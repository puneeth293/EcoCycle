import express from "express";
import path from "path";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase Configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || "zkuongbbsshtpsasdbun";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://zkuongbbsshtpsasdbun.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_MQFwrOt666FXPWnB9Sdc2A_oj5dhofP";

let supabase: SupabaseClient | null = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log(`[Supabase] Initialized client for project ${SUPABASE_PROJECT_ID} at ${SUPABASE_URL}`);
  }
} catch (e) {
  console.warn("[Supabase] Failed to initialize client:", e);
}

const app = express();
const PORT = 3000;

// Gzip & Deflate compression to reduce network transfer sizes across 3G/4G/5G
app.use(compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024, // Compress responses above 1KB
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Fast video static serving with range-support & caching headers
app.use("/videos", express.static(path.join(process.cwd(), "public/videos"), {
  maxAge: "7d",
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
    res.setHeader("Accept-Ranges", "bytes");
  }
}));

// Public assets serving with cache headers
app.use(express.static(path.join(process.cwd(), "public"), {
  maxAge: "1d",
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400");
    }
  }
}));

// Initialize Gemini client server-side if key is present
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// In-memory fallback database for pickup requests in addition to client LocalStorage sync
let pickupRequests: any[] = [
  {
    id: "EC-2026-00125",
    userName: "Puneeth",
    userEmail: "puneeth@example.com",
    userPhone: "+91 98765 43210",
    address: "102 Green Enclave, M.G. Road",
    city: "Tumkur",
    wasteType: "Recyclable Waste",
    quantity: "15 kg",
    preferredDate: "2026-08-10",
    preferredTime: "10:00 AM - 01:00 PM",
    notes: "Paper boxes and washed plastic bottles in separate bags.",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "EC-2026-00126",
    userName: "Rahul Verma",
    userEmail: "rahul@example.com",
    userPhone: "+91 91234 56789",
    address: "45 Eco Heights, Ashok Nagar",
    city: "Tumkur",
    wasteType: "E-Waste",
    quantity: "8 kg",
    preferredDate: "2026-08-11",
    preferredTime: "02:00 PM - 05:00 PM",
    notes: "Old computer monitors and printer cables.",
    status: "Assigned",
    createdAt: new Date().toISOString(),
  },
  {
    id: "EC-2026-00127",
    userName: "Priya Nair",
    userEmail: "priya@example.com",
    userPhone: "+91 99887 76655",
    address: "12 Palm Grove, Indiranagar",
    city: "Bengaluru",
    wasteType: "Dry Waste",
    quantity: "25 kg",
    preferredDate: "2026-08-09",
    preferredTime: "09:00 AM - 12:00 PM",
    notes: "Cardboard packing boxes from moving.",
    status: "Collected",
    createdAt: new Date().toISOString(),
  }
];

// In-memory contact & support messages store
let contactMessages: any[] = [
  {
    id: "CNT-2026-0001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    subject: "Bulk E-Waste Pickup Enquiry",
    message: "We have 35 outdated office PCs and UPS batteries for responsible recycling. Can we schedule an institutional pickup?",
    status: "New",
    createdAt: new Date().toISOString()
  }
];

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "EcoCycle API", timestamp: new Date() });
});

// AI Bot Assistance Copilot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, messages = [], userContext = {} } = req.body;
    const userMessage = message || (messages.length > 0 ? messages[messages.length - 1].content : "");

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "User message is required" });
    }

    const ai = getAiClient();

    if (ai) {
      const systemInstruction = `You are EcoBot, the intelligent AI Environmental Assistant & Sustainability Copilot for the Recynova platform.
Your expertise covers:
1. Solid Waste Segregation & Bin Color Coding:
   - Green Bin 🟢: Wet waste, organic food scraps, vegetable peels, garden waste, tea leaves, compostable matter.
   - Blue Bin 🔵: Dry recyclables, clean plastic bottles (PET), cardboard, paper, aluminum cans, glass jars.
   - Yellow Bin 🟡: E-Waste, old smartphones, lithium batteries, circuit boards, cables, chargers.
   - Red Bin 🔴: Hazardous domestic waste, chemical containers, paints, pesticides, expired medicines.
   - Black Bin ⚫: Non-recyclable sanitary waste and inert dust.
2. Upload Waste & Pollution Reporting:
   - Citizens can upload/capture photos of segregated waste (+35 to +50 Eco Points).
   - Citizens can photograph Air Pollution (chimney smoke, smog, burning), Water Pollution (chemical froth, sewage runoff), and Soil Pollution (illegal dumpsites) to get automated CPCB grievance tickets and earn +50 to +75 Eco Points.
3. Electricity Bill Payments & Eco Points Rebates:
   - Users can search any state electricity provider (BESCOM, Tata Power, MSEDCL, TANGEDCO, BSES, etc.) using their Consumer ID.
   - Users can redeem their accumulated Eco Points for direct cash discounts on electricity bills (1 Eco Point = ₹0.50 off).
   - Paying bills through Recynova awards +50 bonus Eco Points and official BBPS receipts.
4. Doorstep Waste Pickups & Collection Centers:
   - Booking doorstep collection for heavy scrap, recyclables, or e-waste.
   - Finding verified neighborhood collection depots.
5. Composting, Upcycling & Zero-Waste Living tips.

Respond in clear, friendly, and structured Markdown (use bullet points, bold text for key terms). Keep responses helpful and under 150 words unless detailed step-by-step instructions are specifically requested.

Also recommend 2-3 interactive suggested action buttons for the user to click (e.g., {"label": "Pay Electricity Bill", "actionType": "navigate", "target": "electricity-bill"} or {"label": "Upload Waste Photo", "actionType": "navigate", "target": "upload-waste"} or {"label": "Schedule Doorstep Pickup", "actionType": "navigate", "target": "pickup"}).`;

      // Build conversation history format
      const historyPrompt = messages.slice(-5).map((m: any) => `${m.role === 'user' ? 'User' : 'EcoBot'}: ${m.content}`).join('\n');
      const prompt = `${historyPrompt}\nUser: ${userMessage}\nEcoBot:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text ? response.text.trim() : "";
      
      // Determine contextual actions
      const suggestedActions = generateSuggestedActions(userMessage, replyText);

      return res.json({
        reply: replyText,
        suggestedActions,
        source: "gemini",
        timestamp: new Date().toISOString()
      });
    }

    // Fallback AI Bot generator
    const fallbackResponse = generateEcoBotFallback(userMessage);
    return res.json({
      ...fallbackResponse,
      source: "local-copilot",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error in AI chat endpoint:", error);
    const fallbackResponse = generateEcoBotFallback(req.body.message || "help");
    return res.json({
      ...fallbackResponse,
      source: "error-fallback",
      timestamp: new Date().toISOString()
    });
  }
});

function generateSuggestedActions(userQuery: string, _reply: string) {
  const q = userQuery.toLowerCase();
  const actions = [];

  if (q.includes("bill") || q.includes("electricity") || q.includes("bescom") || q.includes("power") || q.includes("rebate") || q.includes("pay")) {
    actions.push({ label: "⚡ Pay Electricity Bill", actionType: "navigate", target: "electricity-bill" });
  }
  if (q.includes("photo") || q.includes("upload") || q.includes("scan") || q.includes("smoke") || q.includes("air") || q.includes("water") || q.includes("pollution")) {
    actions.push({ label: "📸 Upload Waste / Report Pollution", actionType: "navigate", target: "upload-waste" });
  }
  if (q.includes("pickup") || q.includes("collect") || q.includes("doorstep") || q.includes("schedule")) {
    actions.push({ label: "🚚 Request Doorstep Pickup", actionType: "navigate", target: "pickup" });
  }
  if (q.includes("center") || q.includes("location") || q.includes("near me") || q.includes("map")) {
    actions.push({ label: "📍 Find Collection Centers", actionType: "navigate", target: "centers" });
  }
  if (q.includes("bin") || q.includes("segregat") || q.includes("color") || q.includes("sort")) {
    actions.push({ label: "🔍 Waste Classifier Tool", actionType: "navigate", target: "segregation" });
  }

  // Default actions if none matched
  if (actions.length === 0) {
    actions.push(
      { label: "📸 Upload Waste (+50 Pts)", actionType: "navigate", target: "upload-waste" },
      { label: "⚡ Pay Electricity Bill", actionType: "navigate", target: "electricity-bill" },
      { label: "🚚 Doorstep Pickup", actionType: "navigate", target: "pickup" }
    );
  }

  return actions.slice(0, 3);
}

function generateEcoBotFallback(query: string) {
  const q = query.toLowerCase();

  if (q.includes("bill") || q.includes("electricity") || q.includes("power") || q.includes("bescom") || q.includes("tata") || q.includes("discount") || q.includes("rebate")) {
    return {
      reply: `### ⚡ Electricity Bill Payments & Eco Rebates\n\nYou can pay your monthly electricity bills and redeem your earned **Eco Points** for real monetary discounts:\n\n* **Exchange Rate**: **1 Eco Point = ₹0.50 discount** (save up to 50% on your bill total).\n* **Supported Providers**: BESCOM, Tata Power, MSEDCL, TANGEDCO, BSES, Adani Electricity, and more.\n* **Bonus Reward**: Earn **+50 Eco Points** automatically on every successful green digital payment with instant BBPS receipt generation.\n\nWould you like to fetch your current electricity bill now?`,
      suggestedActions: [
        { label: "⚡ Go to Electricity Bill Portal", actionType: "navigate", target: "electricity-bill" },
        { label: "📸 Upload Waste for More Points", actionType: "navigate", target: "upload-waste" }
      ]
    };
  }

  if (q.includes("bin") || q.includes("segregat") || q.includes("color") || q.includes("sort") || q.includes("plastic") || q.includes("food") || q.includes("wet") || q.includes("dry")) {
    return {
      reply: `### 🗑️ Municipal 4-Color Waste Segregation Guide\n\n* 🟢 **Green Bin (Wet Waste)**: Kitchen vegetable peels, leftover food, fruit scraps, coffee grounds, garden leaves. Converts into rich organic compost.\n* 🔵 **Blue Bin (Dry Recyclables)**: PET plastic bottles, clean paper, corrugated cardboard, aluminum drink cans, glass containers. Please rinse and flatten before disposal.\n* 🟡 **Yellow Bin (E-Waste)**: Dead smartphones, chargers, cords, lithium batteries, circuit boards. Recover rare precious metals.\n* 🔴 **Red Bin (Hazardous)**: Expired medicines, aerosol spray cans, paints, chemical solvents, broken mercury thermometers.`,
      suggestedActions: [
        { label: "🔍 Try Waste Classifier Search", actionType: "navigate", target: "segregation" },
        { label: "📸 Scan & Verify Waste Photo", actionType: "navigate", target: "upload-waste" }
      ]
    };
  }

  if (q.includes("photo") || q.includes("upload") || q.includes("reward") || q.includes("points") || q.includes("earn") || q.includes("pollution") || q.includes("air") || q.includes("smoke")) {
    return {
      reply: `### 📸 Upload Waste & Environmental Vision Rewards\n\nRecynova AI analyzes your uploaded photos in real-time:\n\n1. **Solid Waste Photos**: Upload your sorted dry recyclables or compost items to earn **+35 to +50 Eco Points**.\n2. **Pollution Reporting**: Photograph factory chimney smoke, vehicular smog, lake chemical froth, or illegal dumpsites.\n3. **Automated Protection**: AI calculates pollutant metrics (PM2.5, toxicity index), provides safety advice, files a CPCB grievance ticket, and awards **+60 to +75 Eco Points**!`,
      suggestedActions: [
        { label: "📸 Open Upload Waste & Pollution", actionType: "navigate", target: "upload-waste" },
        { label: "⚡ Check Electricity Bill Savings", actionType: "navigate", target: "electricity-bill" }
      ]
    };
  }

  if (q.includes("pickup") || q.includes("doorstep") || q.includes("scrap") || q.includes("schedule") || q.includes("book")) {
    return {
      reply: `### 🚚 Free Doorstep Waste Pickup Service\n\nGot bulky cardboard, e-waste, or large recyclable loads? We send authorized eco-couriers straight to your doorstep:\n\n* **Free Pickup**: For recyclable dry waste, paper/books, metal scraps, and old electronics.\n* **Flexible Slots**: Morning (09:00 AM - 12:00 PM) or Afternoon (02:00 PM - 05:00 PM).\n* **Eco Points Credit**: Earn bonus points credited directly to your account upon verified collection.`,
      suggestedActions: [
        { label: "🚚 Schedule Doorstep Pickup", actionType: "navigate", target: "pickup" },
        { label: "📍 View Nearby Collection Centers", actionType: "navigate", target: "centers" }
      ]
    };
  }

  return {
    reply: `### 👋 Hi there! I'm EcoBot, your AI Environmental Assistant.\n\nI can help you with anything related to sustainable living and the Recynova platform:\n\n* 🗑️ **Waste Segregation**: Ask me which bin any household item belongs in (Green, Blue, Yellow, Red).\n* 📸 **Upload Waste & Pollution**: Learn how to photograph waste or neighborhood smog to earn **+35 to +75 Eco Points**.\n* ⚡ **Electricity Bills**: Redeem your accumulated points for **₹0.50/pt discounts** on BESCOM, Tata Power, and state electricity bills.\n* 🚚 **Doorstep Pickups**: Schedule hassle-free doorstep collection for bulky recyclables and e-waste.\n\nHow can I help you today?`,
    suggestedActions: [
      { label: "🗑️ How do I segregate e-waste?", actionType: "query", target: "How do I safely segregate and dispose of e-waste and lithium batteries?" },
      { label: "⚡ How do I discount my power bill?", actionType: "query", target: "How do I redeem Eco Points to reduce my electricity bill amount?" },
      { label: "💨 How to report air pollution?", actionType: "query", target: "How does the AI pollution reporting and CPCB ticket system work?" }
    ]
  };
}

// AI Waste Classifier endpoint
app.post("/api/classify", async (req, res) => {
  try {
    const { item } = req.body;
    if (!item || typeof item !== "string") {
      return res.status(400).json({ error: "Item string is required" });
    }

    const ai = getAiClient();

    if (!ai) {
      // Fallback rule-based classifier if Gemini API key isn't provided or configured
      const fallbackResult = getLocalWasteClassification(item);
      return res.json({ ...fallbackResult, source: "local" });
    }

    const prompt = `You are an expert environmental engineer and waste management authority. 
Analyze the item: "${item}".
Return a JSON object with strictly these keys:
{
  "itemName": "${item}",
  "category": "Wet Waste" | "Dry Waste" | "Recyclable Waste" | "Hazardous Waste" | "E-Waste",
  "binColor": "Green" | "Blue" | "Red" | "Black" | "Yellow",
  "binName": "Green Bin 🟢" | "Blue Bin 🔵" | "Red Bin 🔴" | "Black Bin ⚫" | "Yellow Bin 🟡",
  "actionSteps": ["step 1", "step 2", "step 3"],
  "recyclingTip": "detailed environmental tip",
  "ecoPoints": number between 10 and 25,
  "environmentalImpact": "Brief statement of why proper segregation of this item helps the environment"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text ? response.text.trim() : "";
    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      return res.json({ ...parsed, source: "gemini" });
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error: any) {
    console.error("Error in AI classification:", error);
    // Graceful fallback
    const fallbackResult = getLocalWasteClassification(req.body.item || "Unknown item");
    return res.json({ ...fallbackResult, source: "local-fallback" });
  }
});

// Helper to extract base64 data and mimeType from data URL or remote image URL
async function extractBase64AndMime(imageInput: string): Promise<{ base64Data: string; mimeType: string } | null> {
  if (!imageInput || typeof imageInput !== "string") return null;

  if (imageInput.startsWith("data:")) {
    const match = imageInput.match(/^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], base64Data: match[2] };
    }
  } else if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
    try {
      const response = await fetch(imageInput);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const mimeType = response.headers.get("content-type") || "image/jpeg";
        const base64Data = Buffer.from(buffer).toString("base64");
        return { mimeType, base64Data };
      }
    } catch (e) {
      console.warn("Could not fetch remote image URL:", e);
    }
  }
  return null;
}

// AI Photo Analyzer & Reward Engine core handler (supports Waste, Air Pollution, Water Pollution, Soil Pollution)
async function handlePhotoAnalysis(req: express.Request, res: express.Response) {
  try {
    const image = req.body.image || req.body.imageData;
    const notes = req.body.notes || req.body.userNote || "";
    const itemNameHint = req.body.itemNameHint || req.body.fileName || "";
    const reportCategory = req.body.reportCategory || req.body.category || "waste";
    const location = req.body.location || req.body.locationText || "Local municipality";

    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Image data (base64 string or URL) is required" });
    }

    const ai = getAiClient();
    const imagePayload = await extractBase64AndMime(image);

    if (ai && imagePayload) {
      const prompt = `You are Recynova's senior AI environmental computer vision inspector and municipal waste segregation expert.
Inspect the user's uploaded photograph carefully.
Selected report category context: "${reportCategory}".
User notes: "${notes || "None provided"}".
Filename or hint: "${itemNameHint || "None"}".
Location reported: "${location || "Local municipality"}".

TASK:
1. Examine the visual features in the photograph and identify the EXACT physical item or environmental condition present. Pay special attention to identifying:
   - PAPERS: office paper sheets, newspapers, notebooks, books, corrugated cardboard box, envelopes, paper cups, egg cartons, cartons, shredded paper, flyers, printed documents. Classify as "Recyclable Waste" (Blue Bin 🔵).
   - BOTTLES & CONTAINERS: plastic water bottles (PET), soda/cold-drink bottles, detergent/shampoo bottles, plastic jars, mineral water jugs, glass bottles (beer, wine, beverage, sauce jars), aluminum soda cans. Classify as "Recyclable Waste" (Blue Bin 🔵).
   - ELECTRONIC DEVICES (E-WASTE): mobile phones, smartphones, chargers, USB cords, power cables, laptops, tablets, computer mice, keyboards, earbuds, headphones, lithium batteries, alkaline batteries, remote controls, circuit boards, electronic appliances. Classify as "E-Waste" (Yellow Bin 🟡).
   - WET / ORGANIC WASTE: fruit peels (banana, apple, citrus), vegetable trimmings, leftover food, tea leaves, compostable matter. Classify as "Wet Waste" (Green Bin 🟢).
   - DOMESTIC HAZARDOUS: paints, chemical solvents, pesticide cans, aerosol spray cans, expired medicines. Classify as "Hazardous Waste" (Red Bin 🔴).
   - POLLUTION: industrial chimney smoke (Air Pollution), foaming river/lake effluent (Water Pollution), illegal open garbage dumpsite (Soil Pollution).

2. Return strictly a JSON object with this schema:
{
  "reportType": "waste" | "air-pollution" | "water-pollution" | "soil-pollution",
  "detectedTitle": string (e.g. "Recyclable Office Paper & Documents" or "PET Plastic Water Bottle" or "Smartphone / Mobile Electronic Device" or "Corrugated Cardboard Box"),
  "categoryOrDomain": string (e.g. "Recyclable Waste", "Wet Waste", "Dry Waste", "E-Waste", "Hazardous Waste", "Air Pollution", "Water Pollution", "Soil Pollution"),
  "binColor": "Blue" | "Green" | "Yellow" | "Red" | "Black" (or null if pollution),
  "binName": "Blue Bin 🔵" | "Green Bin 🟢" | "Yellow Bin 🟡" | "Red Bin 🔴" | "Black Bin ⚫" (or null if pollution),
  "confidenceScore": number (88-99),
  "severityLevel": "Low" | "Moderate" | "Severe" | "Hazardous",
  "sourceOfPollution": string,
  "aqiImpact": string,
  "contaminantsIdentified": string[],
  "conditionNotes": string (1-2 sentences evaluating item state, cleanliness, material grade, or pollution density),
  "actionSteps": string[] (3 clear actionable steps for the citizen),
  "remedialAdvice": string (1-2 sentences on how this is recycled, refined, or mitigated),
  "pointsAwarded": number (35-75),
  "co2SavedKg": number,
  "ticketId": string,
  "funFact": string
}`;

      const visionModels = ["gemini-flash-lite-latest", "gemini-3.8-flash"];
      let aiResponseText = "";

      for (const modelName of visionModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  data: imagePayload.base64Data,
                  mimeType: imagePayload.mimeType,
                },
              },
              prompt,
            ],
            config: {
              responseMimeType: "application/json",
            },
          });

          if (response.text) {
            aiResponseText = response.text.trim();
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Vision model ${modelName} returned error:`, modelErr?.message || modelErr?.status || modelErr);
        }
      }

      if (aiResponseText) {
        try {
          const parsed = JSON.parse(aiResponseText);
          return res.json({ ...parsed, source: "gemini-vision" });
        } catch (e) {
          console.warn("JSON parse error from vision output, using fallback:", e);
        }
      }
    }

    // Fallback computer-vision heuristic analysis
    const hintCombined = `${itemNameHint} ${notes} ${image.length < 500 ? image : ""}`;
    const fallbackResult = generateFallbackMultiDomainAnalysis(hintCombined, reportCategory);
    return res.json({ ...fallbackResult, source: "vision-heuristic" });

  } catch (error: any) {
    console.error("Error analyzing photo with Gemini:", error);
    const fallbackResult = generateFallbackMultiDomainAnalysis(
      `${req.body.itemNameHint || req.body.fileName || ""} ${req.body.notes || req.body.userNote || ""}`,
      req.body.reportCategory || req.body.category || "waste"
    );
    return res.json({ ...fallbackResult, source: "vision-fallback" });
  }
}

// Support both endpoint URLs
app.post("/api/analyze-photo", handlePhotoAnalysis);
app.post("/api/scan-environmental-photo", handlePhotoAnalysis);

function generateFallbackMultiDomainAnalysis(queryHint: string, reportCategory: string) {
  const q = queryHint.toLowerCase();
  const randTicket = `EC-PCB-${Math.floor(10000 + Math.random() * 90000)}`;

  // Explicit Pollution Modes (when user is on Air, Water, or Soil tab)
  if (reportCategory === "air-pollution" || (reportCategory !== "waste" && (q.includes("smoke") || q.includes("chimney") || q.includes("smog") || q.includes("exhaust")))) {
    return {
      reportType: "air-pollution",
      detectedTitle: "Industrial Chimney & High-Density Smoke Emissions",
      categoryOrDomain: "Air Pollution",
      confidenceScore: 96,
      severityLevel: "Severe",
      sourceOfPollution: "Unfiltered industrial combustion exhaust & particulate dispersion",
      aqiImpact: "Estimated Local AQI Spike: 285+ (Very Unhealthy / Hazardous)",
      contaminantsIdentified: ["Particulate Matter (PM2.5 / PM10)", "Sulfur Dioxide (SO2)", "Carbon Monoxide (CO)", "Volatile Organics"],
      conditionNotes: "Dense dark particulate plume observed exceeding standard chimney opacity thresholds.",
      actionSteps: [
        "Wear an N95 or particulate filtration mask if within 500m downwind.",
        "Keep home/school windows sealed and activate HEPA indoor air purifiers.",
        "Automated notice generated and routed to the Central Pollution Control Board (CPCB) air surveillance cell."
      ],
      remedialAdvice: "Industrial units must install wet scrubbers and electrostatic precipitators to trap 99% of particulate soot.",
      pointsAwarded: 55,
      co2SavedKg: 2.10,
      ticketId: `CPCB-AIR-${Math.floor(10000 + Math.random() * 90000)}`,
      funFact: "Reporting industrial smoke violations helps environmental inspectors enforce emission caps that protect over 10,000 neighborhood residents!"
    };
  }

  // Water Pollution Detection (Only when on water-pollution category or explicitly reporting river/foam/effluent)
  if (reportCategory === "water-pollution" || (reportCategory !== "waste" && (q.includes("river pollution") || q.includes("lake foam") || q.includes("effluent") || q.includes("chemical froth") || q.includes("sewage runoff")))) {
    return {
      reportType: "water-pollution",
      detectedTitle: "Untreated Effluent Discharge & Surface Water Contamination",
      categoryOrDomain: "Water Pollution",
      confidenceScore: 97,
      severityLevel: "Hazardous",
      sourceOfPollution: "Chemical surfactant runoff & unchannelized plastic debris in waterway",
      aqiImpact: "Dissolved Oxygen (DO) Critical: Aquatic Toxicity High",
      contaminantsIdentified: ["Surfactant Synthetic Foaming Agents", "Microplastics", "Industrial Heavy Phosphates", "High BOD/COD Effluent"],
      conditionNotes: "Visible chemical froth and discolored water flow entering municipal drainage basin.",
      actionSteps: [
        "Do not use surrounding surface water for irrigation, livestock, or domestic washing.",
        "Maintain safe distance to avoid volatile aerosol inhalation from chemical froth.",
        "Grievance ticket flagged with geolocation for immediate Water Pollution Control inspection."
      ],
      remedialAdvice: "Installation of decentralized bioreactors and oil-grease interceptors prevents 95% of lake frothing and eutrophication.",
      pointsAwarded: 60,
      co2SavedKg: 1.85,
      ticketId: `WPCB-WAT-${Math.floor(10000 + Math.random() * 90000)}`,
      funFact: "Wetlands and constructed reed beds naturally filter heavy nitrates and phosphates before water enters major river basins!"
    };
  }

  // Soil Pollution Detection
  if (reportCategory === "soil-pollution" || (reportCategory !== "waste" && (q.includes("dumpsite") || q.includes("landfill") || q.includes("toxic sludge") || q.includes("soil contamination")))) {
    return {
      reportType: "soil-pollution",
      detectedTitle: "Illegal Open Dumpsite & Leachate Soil Contamination",
      categoryOrDomain: "Soil Pollution",
      confidenceScore: 95,
      severityLevel: "Severe",
      sourceOfPollution: "Unsegregated municipal dumpsite with plastic debris and electronic leachate",
      aqiImpact: "Soil Toxicity Index: Elevated Heavy Metal Risk",
      contaminantsIdentified: ["Phthalate Plasticizers", "Heavy Metal Battery Leachate", "Persistent Organic Pollutants (POPs)", "Microplastics"],
      conditionNotes: "Non-biodegradable synthetic waste directly degrading topsoil fertility and groundwater aquifer barrier.",
      actionSteps: [
        "Prevent agricultural cultivation or grazing within 50m of contaminated dump perimeter.",
        "Deploy bio-mining and localized geomembrane liner containment.",
        "Municipal sanitation wing notified for priority mechanized clearing."
      ],
      remedialAdvice: "Bio-remediation using mycorrhizal fungi and phytoremediation trees extracts heavy metals from damaged soil.",
      pointsAwarded: 50,
      co2SavedKg: 1.40,
      ticketId: `SPCB-SOL-${Math.floor(10000 + Math.random() * 90000)}`,
      funFact: "Healthy soil stores more carbon than the entire atmosphere and all global plant life combined!"
    };
  }

  // 1. Electronic Devices & E-Waste Detection (Mobile phones, chargers, batteries, laptops, accessories)
  if (
    q.includes("phone") || q.includes("mobile") || q.includes("smartphone") || q.includes("cell") ||
    q.includes("electronic") || q.includes("device") || q.includes("gadget") || q.includes("battery") ||
    q.includes("cable") || q.includes("wire") || q.includes("cord") || q.includes("charger") ||
    q.includes("laptop") || q.includes("tablet") || q.includes("circuit") || q.includes("pcb") ||
    q.includes("earbud") || q.includes("headphone") || q.includes("earphone") || q.includes("mouse") ||
    q.includes("keyboard") || q.includes("remote") || q.includes("screen") || q.includes("display") ||
    q.includes("adapter") || q.includes("plug") || q.includes("hardware") || q.includes("computer") ||
    q.includes("e-waste") || q.includes("ewaste") || q.includes("appliance")
  ) {
    const isPhone = q.includes("phone") || q.includes("mobile") || q.includes("smartphone");
    const isCharger = q.includes("charger") || q.includes("cable") || q.includes("wire") || q.includes("cord") || q.includes("adapter");
    const isBattery = q.includes("battery");
    const detectedTitle = isPhone 
      ? "Smartphone / Mobile Electronic Device" 
      : isCharger 
      ? "Electronic Power Cable & Adapter" 
      : isBattery 
      ? "Lithium / Rechargeable Battery Cell" 
      : "Electronic Device / E-Waste Component";

    return {
      reportType: "waste",
      detectedTitle,
      categoryOrDomain: "E-Waste",
      binColor: "Yellow",
      binName: "Yellow Bin 🟡",
      confidenceScore: 99,
      severityLevel: "Moderate",
      sourceOfPollution: "Discarded electronic circuitry, silicon chips, and rechargeable components",
      contaminantsIdentified: ["Lithium", "Cobalt", "Gold / Copper Traces", "Lead-tin solder"],
      conditionNotes: "High-grade recyclable electronic circuit and battery/metal housing identified for safe recovery.",
      actionSteps: [
        "Store in a dry, moisture-free container at room temperature away from direct sunlight.",
        "Tape over exposed battery terminals or connectors to prevent accidental short-circuits.",
        "Deposit in the Yellow E-Waste Bin or book a Recynova doorstep E-Waste specialist pickup."
      ],
      remedialAdvice: "Electronic devices contain precious metals like gold, silver, and copper. Specialized hydrometallurgical refining recycles 98% of components back into high-tech manufacturing.",
      pointsAwarded: 60,
      co2SavedKg: 1.65,
      ticketId: randTicket,
      funFact: "Recycling 1 million smartphones recovers approximately 35,000 lbs of copper, 772 lbs of silver, and 75 lbs of gold!"
    };
  }

  // 2. Plastic Bottles & Containers Detection
  if (
    q.includes("bottle") || q.includes("bottles") || q.includes("pet") || q.includes("water") ||
    q.includes("soda") || q.includes("plastic") || q.includes("jug") || q.includes("container") ||
    q.includes("shampoo") || q.includes("coke") || q.includes("pepsi") || q.includes("sprite") ||
    q.includes("beverage") || q.includes("flask") || q.includes("canister") || q.includes("vial") ||
    q.includes("detergent") || q.includes("tub")
  ) {
    return {
      reportType: "waste",
      detectedTitle: "PET Plastic Water & Beverage Bottle",
      categoryOrDomain: "Recyclable Waste",
      binColor: "Blue",
      binName: "Blue Bin 🔵",
      confidenceScore: 98,
      severityLevel: "Low",
      sourceOfPollution: "Polyethylene Terephthalate polymer (Resin #1)",
      contaminantsIdentified: ["Recyclable thermoplastic PET polymer"],
      conditionNotes: "Clear, clean plastic beverage container. Empty and ready for mechanical processing.",
      actionSteps: [
        "Rinse out any residual liquid with a quick splash of water.",
        "Unscrew cap and crush the bottle body flat to reduce volume.",
        "Deposit in the dry recyclables Blue Bin."
      ],
      remedialAdvice: "Recycled PET bottles are shredded into clean flakes and spun into high-tensile polyester yarns for eco-clothing and textiles.",
      pointsAwarded: 40,
      co2SavedKg: 0.65,
      ticketId: randTicket,
      funFact: "It takes just 5 recycled plastic bottles to create enough polyester fiber for a new athletic T-shirt!"
    };
  }

  // 3. Paper & Cardboard Detection
  if (
    q.includes("paper") || q.includes("papers") || q.includes("cardboard") || q.includes("box") ||
    q.includes("boxes") || q.includes("carton") || q.includes("news") || q.includes("book") ||
    q.includes("sheet") || q.includes("document") || q.includes("envelope") || q.includes("notebook") ||
    q.includes("print") || q.includes("page") || q.includes("flyer") || q.includes("magazine") ||
    q.includes("receipt") || q.includes("stationery")
  ) {
    const isCardboard = q.includes("cardboard") || q.includes("box") || q.includes("carton") || q.includes("boxes");
    return {
      reportType: "waste",
      detectedTitle: isCardboard ? "Corrugated Cardboard Packaging Box" : "Recyclable Office Paper & Documents",
      categoryOrDomain: "Recyclable Waste",
      binColor: "Blue",
      binName: "Blue Bin 🔵",
      confidenceScore: 98,
      severityLevel: "Low",
      sourceOfPollution: "Clean wood-pulp cellulose fibers",
      contaminantsIdentified: ["100% Recyclable Cellulose Paper / Cardboard"],
      conditionNotes: "Dry, clean, non-greasy recyclable paper fibers suitable for pulp re-manufacturing.",
      actionSteps: [
        "Ensure paper is completely dry and free from oil or grease contamination.",
        "Flatten boxes and bundle papers together neatly to optimize transport.",
        "Deposit in the dry recyclables Blue Bin for doorstep pickup."
      ],
      remedialAdvice: "Recycling 1 ton of paper saves 17 mature trees, 7,000 gallons of water, and 4,000 kWh of clean electricity.",
      pointsAwarded: 40,
      co2SavedKg: 0.85,
      ticketId: randTicket,
      funFact: "Paper fibers can be recycled into new notebooks and packaging up to 7 times before degrading!"
    };
  }

  // 4. Glass Jars & Bottles
  if (q.includes("glass") || q.includes("jar") || q.includes("wine") || q.includes("beer")) {
    return {
      reportType: "waste",
      detectedTitle: "Recyclable Glass Bottle & Container",
      categoryOrDomain: "Recyclable Waste",
      binColor: "Blue",
      binName: "Blue Bin 🔵",
      confidenceScore: 99,
      severityLevel: "Low",
      sourceOfPollution: "Silica-based container glass",
      contaminantsIdentified: ["100% Endlessly Recyclable Glass"],
      conditionNotes: "Intact clean glass container, non-broken, free from chemical residues.",
      actionSteps: [
        "Rinse clean to remove food or liquid residues.",
        "Remove metal lids or corks and place them separately.",
        "Place gently in the dry recyclables Blue Bin without shattering."
      ],
      remedialAdvice: "Glass is 100% recyclable and can be melted down and re-molded infinitely with zero loss in purity.",
      pointsAwarded: 45,
      co2SavedKg: 0.50,
      ticketId: randTicket,
      funFact: "A glass bottle can take over 4,000 years to decompose in a landfill, but takes only 30 days to become a new bottle when recycled!"
    };
  }

  // 5. Domestic Hazardous Waste
  if (q.includes("chemical") || q.includes("paint") || q.includes("medicine") || q.includes("spray") || q.includes("pesticide") || q.includes("aerosol") || q.includes("hazardous") || q.includes("solvent")) {
    return {
      reportType: "waste",
      detectedTitle: "Domestic Hazardous Waste / Chemical Container",
      categoryOrDomain: "Hazardous Waste",
      binColor: "Red",
      binName: "Red Bin 🔴",
      confidenceScore: 97,
      severityLevel: "Hazardous",
      sourceOfPollution: "Toxic chemical or hazardous solvent packaging",
      contaminantsIdentified: ["Chemical toxins", "Flammable propellant", "Heavy metals"],
      conditionNotes: "Hazardous packaging requires isolated containment to prevent environmental contamination.",
      actionSteps: [
        "Do not pour residual chemicals down municipal drains or sinks.",
        "Keep in original container with tightly sealed lid.",
        "Deposit in the Red Hazardous Waste Bin or deliver to authorized municipal hazardous collection center."
      ],
      remedialAdvice: "Hazardous waste is neutralized through high-temperature incineration or stabilization in specialized secure landfills.",
      pointsAwarded: 50,
      co2SavedKg: 1.20,
      ticketId: randTicket,
      funFact: "Proper hazardous waste disposal prevents toxic chemicals from leaching into municipal groundwater aquifers!"
    };
  }

  // 6. Wet Waste & Food Scraps
  if (q.includes("peel") || q.includes("banana") || q.includes("food") || q.includes("vegetable") || q.includes("fruit") || q.includes("apple") || q.includes("organic") || q.includes("leaf") || q.includes("tea")) {
    return {
      reportType: "waste",
      detectedTitle: "Organic Kitchen & Fruit Scraps",
      categoryOrDomain: "Wet Waste",
      binColor: "Green",
      binName: "Green Bin 🟢",
      confidenceScore: 96,
      severityLevel: "Low",
      sourceOfPollution: "Biodegradable domestic organic scraps",
      contaminantsIdentified: ["Organic compostable matter"],
      conditionNotes: "100% biodegradable organic matter detected, free of synthetic packaging.",
      actionSteps: [
        "Drain excess liquids before disposing in the green bin.",
        "Add to home vermicompost or community organic waste pit.",
        "Keep sealed to prevent insect attraction and odor."
      ],
      remedialAdvice: "Rich in nitrogen and potassium — converts to premium natural fertilizer within 30-45 days of composting.",
      pointsAwarded: 35,
      co2SavedKg: 0.38,
      ticketId: randTicket,
      funFact: "Composting 1 kg of food scraps prevents roughly 0.5 kg of greenhouse gases generated in anaerobic landfills!"
    };
  }

  // 7. Metal Cans & Aluminum
  if (q.includes("can") || q.includes("cans") || q.includes("metal") || q.includes("tin") || q.includes("aluminum") || q.includes("foil")) {
    return {
      reportType: "waste",
      detectedTitle: "Aluminum Beverage Container",
      categoryOrDomain: "Recyclable Waste",
      binColor: "Blue",
      binName: "Blue Bin 🔵",
      confidenceScore: 99,
      severityLevel: "Low",
      sourceOfPollution: "Clean aluminum packaging",
      contaminantsIdentified: ["100% Recyclable Aluminum"],
      conditionNotes: "Rinsed metallic container with high recyclability index.",
      actionSteps: [
        "Quickly rinse out residual liquid with cold water.",
        "Crush vertically to save storage footprint.",
        "Deposit in the dry recyclables blue bin."
      ],
      remedialAdvice: "Aluminum can be recycled endlessly with zero degradation in material strength or purity.",
      pointsAwarded: 45,
      co2SavedKg: 1.10,
      ticketId: randTicket,
      funFact: "Recycling a single aluminum can saves enough energy to power a TV for nearly 3 hours!"
    };
  }

  // Default clean recyclable plastic / dry waste item
  return {
    reportType: "waste",
    detectedTitle: "Recyclable Packaging & Polymer Item",
    categoryOrDomain: "Recyclable Waste",
    binColor: "Blue",
    binName: "Blue Bin 🔵",
    confidenceScore: 95,
    severityLevel: "Low",
    sourceOfPollution: "Recyclable municipal solid waste material",
    contaminantsIdentified: ["Clean recyclable packaging material"],
    conditionNotes: "Clean, dry recyclable material identified. Segregated properly for municipal recovery.",
    actionSteps: [
      "Ensure item is rinsed and free from perishable residues.",
      "Flatten or compact before disposal to save bin capacity.",
      "Deposit in the dry recyclables Blue Bin for processing."
    ],
    remedialAdvice: "Proper segregation at source keeps 90% of dry recyclable materials out of municipal landfills.",
    pointsAwarded: 40,
    co2SavedKg: 0.65,
    ticketId: randTicket,
    funFact: "Every ton of segregated recyclables diverts over 3 cubic yards of waste from overflowing dumpsites!"
  };
}

// ==========================================
// ELECTRICITY BILL & GREEN REBATES API
// ==========================================
const ELECTRICITY_PROVIDERS = [
  { id: 'bescom', name: 'BESCOM (Bangalore Electricity Supply Co.)', state: 'Karnataka', shortCode: 'BESCOM', logo: '⚡', helpline: '1912', sampleConsumerNumber: 'BESCOM-99281' },
  { id: 'mescom', name: 'MESCOM (Mangalore Electricity Supply Co.)', state: 'Karnataka', shortCode: 'MESCOM', logo: '⚡', helpline: '1912', sampleConsumerNumber: 'MESCOM-44810' },
  { id: 'hescom', name: 'HESCOM (Hubli Electricity Supply Co.)', state: 'Karnataka', shortCode: 'HESCOM', logo: '⚡', helpline: '1912', sampleConsumerNumber: 'HESCOM-12840' },
  { id: 'tatapower', name: 'Tata Power DDL (Delhi / Mumbai)', state: 'Delhi & Maharashtra', shortCode: 'TATA', logo: '🔋', helpline: '1800-208-9121', sampleConsumerNumber: 'TATA-88123' },
  { id: 'bsesyamuna', name: 'BSES Yamuna Power Ltd', state: 'Delhi', shortCode: 'BYPL', logo: '⚡', helpline: '19122', sampleConsumerNumber: 'BYPL-55201' },
  { id: 'bsesrajdhani', name: 'BSES Rajdhani Power Ltd', state: 'Delhi', shortCode: 'BRPL', logo: '⚡', helpline: '19123', sampleConsumerNumber: 'BRPL-77192' },
  { id: 'adani', name: 'Adani Electricity Mumbai Ltd', state: 'Maharashtra', shortCode: 'ADANI', logo: '💡', helpline: '19122', sampleConsumerNumber: 'ADANI-66320' },
  { id: 'tneb', name: 'TANGEDCO / TNEB (Tamil Nadu)', state: 'Tamil Nadu', shortCode: 'TNEB', logo: '⚡', helpline: '94987-94987', sampleConsumerNumber: 'TNEB-33105' },
  { id: 'wbsedcl', name: 'WBSEDCL (West Bengal State Electricity)', state: 'West Bengal', shortCode: 'WBSEDCL', logo: '⚡', helpline: '19121', sampleConsumerNumber: 'WBSEDCL-49210' },
  { id: 'torrent', name: 'Torrent Power (Ahmedabad / Surat / Agra)', state: 'Gujarat & UP', shortCode: 'TORRENT', logo: '⚡', helpline: '19124', sampleConsumerNumber: 'TORRENT-88301' },
];

// In-memory bills store with presets & auto-generator
let electricityBillsStore: Record<string, any> = {
  'BESCOM-99281': {
    id: 'bill-bescom-01',
    consumerNumber: 'BESCOM-99281',
    consumerName: 'Puneeth Kumar A',
    providerId: 'bescom',
    providerName: 'BESCOM (Bangalore Electricity Supply Co.)',
    billingMonth: 'August 2026',
    dueDate: '2026-08-28',
    unitsConsumedKwh: 245,
    billAmount: 1480,
    energyCharges: 1150,
    fixedCharges: 160,
    greenCessCharges: 45,
    taxes: 125,
    isPaid: false,
    carbonFootprintKg: 196,
    solarDiscountEligible: true
  },
  'TATA-88123': {
    id: 'bill-tata-02',
    consumerNumber: 'TATA-88123',
    consumerName: 'Ananya Sharma',
    providerId: 'tatapower',
    providerName: 'Tata Power DDL',
    billingMonth: 'August 2026',
    dueDate: '2026-08-30',
    unitsConsumedKwh: 310,
    billAmount: 1950,
    energyCharges: 1550,
    fixedCharges: 180,
    greenCessCharges: 60,
    taxes: 160,
    isPaid: false,
    carbonFootprintKg: 248,
    solarDiscountEligible: true
  },
  'MESCOM-44810': {
    id: 'bill-mescom-03',
    consumerNumber: 'MESCOM-44810',
    consumerName: 'Rahul Hegde',
    providerId: 'mescom',
    providerName: 'MESCOM (Mangalore Electricity Supply Co.)',
    billingMonth: 'August 2026',
    dueDate: '2026-09-02',
    unitsConsumedKwh: 180,
    billAmount: 1050,
    energyCharges: 820,
    fixedCharges: 120,
    greenCessCharges: 30,
    taxes: 80,
    isPaid: false,
    carbonFootprintKg: 144,
    solarDiscountEligible: false
  }
};

let paymentTransactions: any[] = [
  {
    transactionId: 'TXN-ECO-98412',
    consumerNumber: 'BESCOM-99281',
    consumerName: 'Puneeth Kumar A',
    providerName: 'BESCOM (Bangalore Electricity Supply Co.)',
    billingMonth: 'July 2026',
    originalAmount: 1420,
    ecoPointsRedeemed: 150,
    discountAmount: 75,
    finalAmountPaid: 1345,
    paymentMethod: 'UPI (GPay / PhonePe)',
    paymentStatus: 'Success',
    paidAt: '2026-07-24',
    bbpsReference: 'BBPS-2026-0724-8841920',
    ecoPointsAwarded: 50
  }
];

// List Providers
app.get("/api/electricity/providers", (_req, res) => {
  res.json(ELECTRICITY_PROVIDERS);
});

// Fetch Bill by Consumer Number
app.post("/api/electricity/fetch-bill", (req, res) => {
  const { consumerNumber, providerId } = req.body;
  if (!consumerNumber) {
    return res.status(400).json({ error: "Consumer number is required" });
  }

  const cleanNum = consumerNumber.trim().toUpperCase();

  // If already exists
  if (electricityBillsStore[cleanNum]) {
    return res.json(electricityBillsStore[cleanNum]);
  }

  // Generate a realistic bill for dynamic numbers
  const provider = ELECTRICITY_PROVIDERS.find(p => p.id === providerId) || ELECTRICITY_PROVIDERS[0];
  const units = Math.floor(140 + Math.random() * 220);
  const energyCharges = Math.round(units * 5.2);
  const fixedCharges = 140;
  const greenCess = Math.round(units * 0.2);
  const taxes = Math.round((energyCharges + fixedCharges) * 0.09);
  const total = energyCharges + fixedCharges + greenCess + taxes;

  const generatedBill = {
    id: `bill-${Date.now()}`,
    consumerNumber: cleanNum,
    consumerName: 'Verified Consumer Account',
    providerId: provider.id,
    providerName: provider.name,
    billingMonth: 'August 2026',
    dueDate: '2026-08-29',
    unitsConsumedKwh: units,
    billAmount: total,
    energyCharges,
    fixedCharges,
    greenCessCharges: greenCess,
    taxes,
    isPaid: false,
    carbonFootprintKg: Math.round(units * 0.82),
    solarDiscountEligible: true
  };

  electricityBillsStore[cleanNum] = generatedBill;
  res.json(generatedBill);
});

// Pay Electricity Bill with Eco Points redemption
app.post("/api/electricity/pay-bill", (req, res) => {
  try {
    const { consumerNumber, paymentMethod, ecoPointsRedeemed = 0 } = req.body;
    if (!consumerNumber) {
      return res.status(400).json({ error: "Consumer number is required" });
    }

    const cleanNum = consumerNumber.trim().toUpperCase();
    let bill = electricityBillsStore[cleanNum];

    if (!bill) {
      return res.status(404).json({ error: "Bill not found for this consumer number" });
    }

    // 1 Eco Point = ₹0.50 discount (max up to 50% of bill)
    const maxRedeemPoints = Math.floor(bill.billAmount);
    const safeRedeemedPoints = Math.min(ecoPointsRedeemed, maxRedeemPoints);
    const discount = Math.round(safeRedeemedPoints * 0.50);
    const finalPaid = Math.max(bill.billAmount - discount, 0);

    const transactionId = `TXN-ECO-${Math.floor(100000 + Math.random() * 900000)}`;
    const bbpsRef = `BBPS-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const bonusPoints = 50; // Bonus points for paying green electricity bill

    const record = {
      transactionId,
      consumerNumber: cleanNum,
      consumerName: bill.consumerName,
      providerName: bill.providerName,
      billingMonth: bill.billingMonth,
      originalAmount: bill.billAmount,
      ecoPointsRedeemed: safeRedeemedPoints,
      discountAmount: discount,
      finalAmountPaid: finalPaid,
      paymentMethod: paymentMethod || 'UPI Instant Pay',
      paymentStatus: 'Success',
      paidAt: new Date().toISOString().split('T')[0],
      bbpsReference: bbpsRef,
      ecoPointsAwarded: bonusPoints
    };

    // Mark as paid
    bill.isPaid = true;
    paymentTransactions.unshift(record);

    res.json({
      success: true,
      message: "Electricity bill paid successfully with BBPS authorization!",
      transaction: record,
      updatedBill: bill
    });

  } catch (err: any) {
    console.error("Error paying electricity bill:", err);
    res.status(500).json({ error: "Failed to process electricity bill payment" });
  }
});

// List Transactions
app.get("/api/electricity/transactions", (_req, res) => {
  res.json(paymentTransactions);
});

// ==========================================
// SUPABASE-INTEGRATED PICKUP REQUESTS API
// ==========================================
const PICKUP_TABLE_CANDIDATES = [
  'pickup_requests',
  'pickuprequests',
  'pickup_request',
  'pickuprequest',
  'pickups',
  'pickup'
];

const CONTACT_TABLE_CANDIDATES = [
  'contact_messages',
  'contactmessages',
  'contact_message',
  'contactmessage',
  'contacts',
  'contact'
];

app.get("/api/pickups", async (_req, res) => {
  if (supabase) {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((row: any) => ({
            id: row.id,
            userName: row.user_name || row.userName || 'Resident',
            userEmail: row.user_email || row.userEmail || '',
            userPhone: row.user_phone || row.userPhone || '',
            address: row.address || '',
            city: row.city || '',
            wasteType: row.waste_type || row.wasteType || 'Recyclable Waste',
            quantity: row.quantity || '',
            preferredDate: row.preferred_date || row.preferredDate || '',
            preferredTime: row.preferred_time || row.preferredTime || '',
            notes: row.notes || '',
            status: row.status || 'Pending',
            createdAt: row.created_at || row.createdAt || new Date().toISOString()
          }));
          return res.json(mapped);
        }
      } catch (err) {
        console.warn(`[Supabase] GET /api/pickups check on '${tableName}':`, err);
      }
    }
  }
  res.json(pickupRequests);
});

app.post("/api/pickups", async (req, res) => {
  const newPickup = req.body;
  const requestId = newPickup.id || `EC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullRecord = {
    ...newPickup,
    id: requestId,
    status: newPickup.status || "Pending",
    createdAt: newPickup.createdAt || new Date().toISOString(),
  };

  // 1. Keep in memory for instant local availability
  pickupRequests.unshift(fullRecord);

  // 2. Persist to Supabase pickup table
  let supabaseSaved = false;
  let savedTable: string | null = null;
  let supabaseError: string | null = null;

  if (supabase) {
    const snakePayload = {
      id: fullRecord.id,
      user_name: fullRecord.userName || '',
      user_email: fullRecord.userEmail || '',
      user_phone: fullRecord.userPhone || '',
      address: fullRecord.address || '',
      city: fullRecord.city || '',
      waste_type: fullRecord.wasteType || 'Recyclable Waste',
      quantity: fullRecord.quantity || '',
      preferred_date: fullRecord.preferredDate || '',
      preferred_time: fullRecord.preferredTime || '',
      notes: fullRecord.notes || '',
      status: fullRecord.status || 'Pending',
      created_at: fullRecord.createdAt
    };

    const camelPayload = {
      id: fullRecord.id,
      userName: fullRecord.userName,
      userEmail: fullRecord.userEmail,
      userPhone: fullRecord.userPhone,
      address: fullRecord.address,
      city: fullRecord.city,
      wasteType: fullRecord.wasteType,
      quantity: fullRecord.quantity,
      preferredDate: fullRecord.preferredDate,
      preferredTime: fullRecord.preferredTime,
      notes: fullRecord.notes || '',
      status: fullRecord.status || 'Pending',
      createdAt: fullRecord.createdAt
    };

    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      try {
        const { error: snakeErr } = await supabase
          .from(tableName)
          .upsert(snakePayload, { onConflict: 'id' });

        if (!snakeErr) {
          supabaseSaved = true;
          savedTable = tableName;
          break;
        }

        if (snakeErr.code !== 'PGRST205') {
          const { error: camelErr } = await supabase
            .from(tableName)
            .upsert(camelPayload, { onConflict: 'id' });

          if (!camelErr) {
            supabaseSaved = true;
            savedTable = tableName;
            break;
          }
          supabaseError = camelErr.message;
        } else {
          supabaseError = snakeErr.message;
        }
      } catch (err: any) {
        supabaseError = err?.message;
      }
    }
  }

  res.status(201).json({
    ...fullRecord,
    supabaseSaved,
    savedTable,
    supabaseError: supabaseSaved ? null : (supabaseError || "Table 'pickup_requests' not created in Supabase project yet")
  });
});

app.put("/api/pickups/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = pickupRequests.findIndex((p) => p.id === id);
  if (index !== -1) {
    pickupRequests[index].status = status;
  }

  if (supabase) {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      try {
        const { error } = await supabase.from(tableName).update({ status }).eq('id', id);
        if (!error) break;
      } catch {}
    }
  }

  if (index !== -1) {
    return res.json(pickupRequests[index]);
  }
  return res.status(200).json({ id, status });
});

// ==========================================
// SUPABASE-INTEGRATED CONTACT MESSAGES API
// ==========================================
app.get("/api/contacts", async (_req, res) => {
  if (supabase) {
    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return res.json(data.map((r: any) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            subject: r.subject || '',
            message: r.message,
            status: r.status || 'New',
            createdAt: r.created_at || r.createdAt || new Date().toISOString()
          })));
        }
      } catch {}
    }
  }
  res.json(contactMessages);
});

app.post("/api/contacts", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const contactRecord = {
    id: `CNT-${Date.now()}`,
    name,
    email,
    subject: subject || "Support & Service Inquiry",
    message,
    status: "New",
    createdAt: new Date().toISOString()
  };

  contactMessages.unshift(contactRecord);

  let supabaseSaved = false;
  let savedTable: string | null = null;
  let supabaseError: string | null = null;

  if (supabase) {
    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      try {
        const { error } = await supabase.from(tableName).upsert({
          id: contactRecord.id,
          name: contactRecord.name,
          email: contactRecord.email,
          subject: contactRecord.subject,
          message: contactRecord.message,
          status: contactRecord.status,
          created_at: contactRecord.createdAt
        }, { onConflict: 'id' });

        if (!error) {
          supabaseSaved = true;
          savedTable = tableName;
          console.log(`[Supabase] Contact saved to '${tableName}': ${contactRecord.id}`);
          break;
        } else {
          supabaseError = error.message;
        }
      } catch (err: any) {
        supabaseError = err?.message;
      }
    }
  }

  res.status(201).json({
    success: true,
    message: supabaseSaved 
      ? `Contact message saved to Supabase table '${savedTable}'!` 
      : "Message saved locally. Create 'contact_messages' table in Supabase to sync.",
    record: contactRecord,
    supabaseSaved,
    savedTable,
    supabaseError: supabaseSaved ? null : (supabaseError || "Table 'contact_messages' not found in Supabase")
  });
});

// Bulk sync endpoint to sync all local data to Supabase once tables are created
app.post("/api/supabase/sync-all", async (req, res) => {
  const { pickups = [], contacts = [] } = req.body;
  let syncedPickups = 0;
  let syncedContacts = 0;
  let pickupError: string | null = null;
  let contactError: string | null = null;

  if (supabase) {
    // 1. Sync pickups
    for (const p of pickups) {
      for (const tableName of PICKUP_TABLE_CANDIDATES) {
        const { error } = await supabase.from(tableName).upsert({
          id: p.id,
          user_name: p.userName,
          user_email: p.userEmail,
          user_phone: p.userPhone,
          address: p.address,
          city: p.city,
          waste_type: p.wasteType,
          quantity: p.quantity,
          preferred_date: p.preferredDate,
          preferred_time: p.preferredTime,
          notes: p.notes || '',
          status: p.status || 'Pending',
          created_at: p.createdAt || new Date().toISOString()
        }, { onConflict: 'id' });

        if (!error) {
          syncedPickups++;
          break;
        } else {
          pickupError = error.message;
        }
      }
    }

    // 2. Sync contacts
    for (const c of contacts) {
      for (const tableName of CONTACT_TABLE_CANDIDATES) {
        const { error } = await supabase.from(tableName).upsert({
          id: c.id,
          name: c.name,
          email: c.email,
          subject: c.subject || '',
          message: c.message,
          status: c.status || 'New',
          created_at: c.createdAt || new Date().toISOString()
        }, { onConflict: 'id' });

        if (!error) {
          syncedContacts++;
          break;
        } else {
          contactError = error.message;
        }
      }
    }
  }

  res.json({
    success: syncedPickups > 0 || syncedContacts > 0,
    syncedPickups,
    syncedContacts,
    pickupError,
    contactError
  });
});

// ==========================================
// SUPABASE CONNECTION STATUS & SCHEMA INFO
// ==========================================
app.get("/api/supabase/status", async (_req, res) => {
  let connected = false;
  let pickupTableReady = false;
  let activePickupTable: string | null = null;
  let contactTableReady = false;
  let activeContactTable: string | null = null;
  let errorMsg = null;

  if (supabase) {
    try {
      connected = true;

      // Check pickups across candidates
      for (const table of PICKUP_TABLE_CANDIDATES) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (!error) {
          pickupTableReady = true;
          activePickupTable = table;
          break;
        }
      }

      // Check contacts across candidates
      for (const table of CONTACT_TABLE_CANDIDATES) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (!error) {
          contactTableReady = true;
          activeContactTable = table;
          break;
        }
      }
    } catch (e: any) {
      errorMsg = e?.message;
    }
  }

  res.json({
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    connected,
    pickupTableReady,
    activePickupTable,
    contactTableReady,
    activeContactTable,
    error: errorMsg,
    sqlSetupUrl: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`,
    tableEditorUrl: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`
  });
});

// Local waste lookup rules for instant response / fallback
function getLocalWasteClassification(query: string) {
  const q = query.toLowerCase().trim();

  if (
    q.includes("banana") ||
    q.includes("apple") ||
    q.includes("food") ||
    q.includes("vegetable") ||
    q.includes("peel") ||
    q.includes("fruit") ||
    q.includes("leaf") ||
    q.includes("tea") ||
    q.includes("coffee") ||
    q.includes("organic")
  ) {
    return {
      itemName: query,
      category: "Wet Waste",
      binColor: "Green",
      binName: "Green Bin 🟢",
      actionSteps: [
        "Collect in a compostable or lined wet waste bin.",
        "Keep free from non-biodegradable plastic wrappers.",
        "Transfer to home compost or wet waste collection."
      ],
      recyclingTip: "Wet organic waste can be converted into rich nutrient compost for soil enrichment.",
      ecoPoints: 15,
      environmentalImpact: "Composting organic waste prevents methane emissions from landfill decay."
    };
  }

  if (
    q.includes("phone") ||
    q.includes("computer") ||
    q.includes("laptop") ||
    q.includes("cable") ||
    q.includes("charger") ||
    q.includes("circuit") ||
    q.includes("tv") ||
    q.includes("electronic") ||
    q.includes("keyboard") ||
    q.includes("e-waste")
  ) {
    return {
      itemName: query,
      category: "E-Waste",
      binColor: "Yellow",
      binName: "Yellow Bin 🟡",
      actionSteps: [
        "Store in a dry, safe container away from heat.",
        "Wipe personal data before disposal if applicable.",
        "Drop off at a certified E-Waste collection center or request pickup."
      ],
      recyclingTip: "E-waste contains precious metals like copper, gold, and silver that can be reclaimed.",
      ecoPoints: 25,
      environmentalImpact: "Proper E-waste disposal prevents toxic heavy metals like lead and cadmium from contaminating soil and water."
    };
  }

  if (
    q.includes("battery") ||
    q.includes("paint") ||
    q.includes("chemical") ||
    q.includes("medicine") ||
    q.includes("syringe") ||
    q.includes("bleach") ||
    q.includes("pesticide") ||
    q.includes("bulb") ||
    q.includes("hazardous")
  ) {
    return {
      itemName: query,
      category: "Hazardous Waste",
      binColor: "Red",
      binName: "Red Bin 🔴",
      actionSteps: [
        "Keep sealed in original leak-proof container.",
        "Do not dump down drains or mix with general trash.",
        "Hand over to authorized hazardous waste collection units."
      ],
      recyclingTip: "Hazardous materials require chemical neutralization and specialized high-temp incineration.",
      ecoPoints: 20,
      environmentalImpact: "Safely isolating hazardous waste protects municipal workers and aquatic eco-systems."
    };
  }

  if (
    q.includes("bottle") ||
    q.includes("plastic") ||
    q.includes("can") ||
    q.includes("glass") ||
    q.includes("paper") ||
    q.includes("cardboard") ||
    q.includes("metal") ||
    q.includes("jar") ||
    q.includes("newspaper") ||
    q.includes("box")
  ) {
    return {
      itemName: query,
      category: "Recyclable Waste",
      binColor: "Blue",
      binName: "Blue Bin 🔵",
      actionSteps: [
        "Rinse and empty any food or liquid residue.",
        "Flatten cardboard boxes or crush plastic bottles to save space.",
        "Place in dry recyclable collection stream."
      ],
      recyclingTip: "Clean paper and plastics can be reprocessed up to 7 times into new packaging materials.",
      ecoPoints: 15,
      environmentalImpact: "Recycling 1 ton of paper saves 17 trees and 7,000 gallons of water."
    };
  }

  return {
    itemName: query,
    category: "Dry Waste",
    binColor: "Blue",
    binName: "Blue Bin 🔵",
    actionSteps: [
      "Ensure the item is completely dry and free from organic contaminants.",
      "Separate materials into paper, plastic, or composite packaging.",
      "Place in your local dry waste collection bin."
    ],
    recyclingTip: "Always separate multi-layer packaging when possible to aid optical sorting at recovery facilities.",
    ecoPoints: 10,
    environmentalImpact: "Dry waste segregation increases the efficiency of municipal material recovery facilities."
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Recynova server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
