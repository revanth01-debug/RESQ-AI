var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "operational",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "RESQ AI Emergency Response System",
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    });
  });
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, context, language = "English" } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        const lower = (message || "").toLowerCase();
        let fallbackReply = `[PROTOTYPE RESQ AI] For your safety regarding "${message}": Move immediately to higher ground or the nearest structural shelter. Avoid walking or driving through floodwaters. Follow instructions from emergency personnel. Emergency Dispatch: 911 / 112.`;
        if (lower.includes("shelter")) {
          fallbackReply = `[PROTOTYPE RESQ AI] The nearest primary safe shelter is "Community Civic Center Shelter" located 1.2 km North-East (Capacity: 78% occupied, 140 spots open). Route: Via Main Elevated Parkway. Medical triage and drinking water available.`;
        } else if (lower.includes("hospital") || lower.includes("medical") || lower.includes("injured")) {
          fallbackReply = `[PROTOTYPE RESQ AI] Nearest emergency facility is "City Metro Trauma Hospital" (Distance: 2.8 km, 42 triage beds open, 8 ICU units ready, accepting critical cases). Dispatching Medical Team RT-01 to adjacent zone.`;
        } else if (lower.includes("trapped") || lower.includes("rescue")) {
          fallbackReply = `[PROTOTYPE RESQ AI] \u26A0\uFE0F EMERGENCY PROTOCOL: Stay calm. If trapped in rising water, move to the highest level/roof, do not enter closed attics. Signal with a bright cloth, flashlight, or phone screen. A rescue request priority alert has been registered in the command queue (Simulated Ticket: #RESQ-URGENT).`;
        } else if (lower.includes("route") || lower.includes("evacuat")) {
          fallbackReply = `[PROTOTYPE RESQ AI] Recommended Evacuation Route: Take Elevated Ring Road East (Route A, Estimated travel: 14 mins). Avoid Grand Valley Underpass due to 1.8m standing floodwater.`;
        }
        return res.json({ response: fallbackReply, source: "simulated_engine" });
      }
      const systemPrompt = `You are "RESQ AI Assistant", an advanced, calm, highly authoritative, concise emergency response and disaster safety assistant. 
Respond in ${language}.
Provide clear, life-saving bullet points or instructions in 2-4 sentences max.
Always include safety directives first.
Remind the user that this is a prototype emergency simulation system.
Current Incident Context: ${JSON.stringify(context || {})}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3
        }
      });
      res.json({
        response: response.text || "Emergency advice processed. Stay safe and stay tuned to official broadcasts.",
        source: "gemini-3.7-flash"
      });
    } catch (err) {
      console.error("Gemini Assistant error:", err);
      res.json({
        response: `[Emergency Protocol Automated Response] Seek shelter immediately on high ground. Keep communication devices charged and monitor RESQ AI live alerts. (Note: AI fallback active).`,
        source: "fallback_engine",
        error: err.message
      });
    }
  });
  app.post("/api/gemini/situation-summary", async (req, res) => {
    try {
      const { incident, telemetry, resources } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          summary: `Severe ${incident?.type || "Flood"} event detected in ${incident?.location || "Zone A - Metro Delta"}. Water levels rising rapidly past threshold (+1.4m/hr). Approximately ${incident?.peopleAtRisk || "8,400"} citizens in high-risk zones. 3 critical transport corridors blocked. 6 Rapid Rescue teams active on-site. Hospital trauma load at 68% capacity.`,
          recommendedActions: [
            "Initiate mandatory evacuation for low-lying Sectors 3, 4, and 7.",
            "Deploy NDRF Rescue Teams RT-01 & RT-04 with inflatable watercraft.",
            "Trigger multi-channel emergency broadcast (SMS, Sirens, Web).",
            "Pre-position emergency water & medical kits at Civic Center Shelter."
          ],
          aiConfidence: 94,
          threatLevel: "CRITICAL",
          source: "simulated_engine"
        });
      }
      const prompt = `Generate a high-level military/emergency commander situation report and 4 urgent actionable bullet points for this incident data:
Disaster Type: ${incident?.type || "Flood"}
Location: ${incident?.location || "Zone A"}
Severity: ${incident?.severity || "Critical"}
People At Risk: ${incident?.peopleAtRisk || "12,000"}
Telemetry: ${JSON.stringify(telemetry || {})}
Resources: ${JSON.stringify(resources || {})}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are RESQ AI Strategic Disaster Analysis Engine. Output clear factual tactical summary followed by 4 concise numbered recommendations.",
          temperature: 0.2
        }
      });
      const text = response.text || "";
      res.json({
        summary: text,
        recommendedActions: [
          "Begin evacuation of vulnerable residential sectors immediately.",
          "Dispatch additional specialized rescue and paramedic units.",
          "Reroute civilian transit away from submerged arterial roadways.",
          "Issue emergency public push alerts and activate audible warning sirens."
        ],
        aiConfidence: 96,
        threatLevel: incident?.severity || "CRITICAL",
        source: "gemini-3.7-flash"
      });
    } catch (err) {
      console.error("Situation summary error:", err);
      res.json({
        summary: "Tactical Situation Summary: Rapid response protocol engaged. High risk detected across active sectors. Rescue and logistics teams dispatched.",
        recommendedActions: [
          "Evacuate high-risk zones immediately.",
          "Establish medical triage perimeters.",
          "Verify shelter supply logistics."
        ],
        aiConfidence: 92,
        threatLevel: "HIGH",
        source: "fallback_engine"
      });
    }
  });
  app.post("/api/gemini/threat-analysis", async (req, res) => {
    const { sensorData, disasterType } = req.body || {};
    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          threatDetected: true,
          type: disasterType || "Flood",
          confidence: 94,
          risk: "CRITICAL",
          anomaly: "Rapid hydrological surge (+48mm/hr rainfall & 2.1m crest)",
          action: "Initiate immediate evacuation for low-lying riverbank sectors and mobilize swift-water rescue teams.",
          timelinePrediction: "Peak impact expected in 1h 45m. Water recession estimated in 18 hours.",
          source: "simulated_engine"
        });
      }
      const prompt = `Analyze sensor telemetry: ${JSON.stringify(sensorData || {})}. Disaster type: ${disasterType}. Determine threat detection status, confidence percentage (0-100), risk tier (LOW, MEDIUM, HIGH, CRITICAL), identified anomaly, immediate action, and 6-hour projection.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are RESQ AI Anomaly & Threat Detection Classifier. Return authoritative, structured threat assessment."
        }
      });
      res.json({
        threatDetected: true,
        type: disasterType || "Flood",
        confidence: 95,
        risk: "CRITICAL",
        anomaly: response.text?.slice(0, 180) || "Sensor anomalies detected exceeding safe operational thresholds.",
        action: "Activate emergency response protocols and notify local rescue units.",
        timelinePrediction: "Peak impact within 2 hours. High alert maintained.",
        source: "gemini-3.7-flash"
      });
    } catch (err) {
      res.json({
        threatDetected: true,
        type: disasterType || "Flood",
        confidence: 91,
        risk: "HIGH",
        anomaly: "Hydrological rate of change exceeded alert criteria (+35%).",
        action: "Alert command center and inspect flood barriers.",
        timelinePrediction: "Impact within 3 hours.",
        source: "fallback_engine"
      });
    }
  });
  app.post("/api/gemini/craft-alert", async (req, res) => {
    try {
      const { alertType, disasterType, zone, language = "English" } = req.body;
      const ai = getGeminiClient();
      const defaultTemplates = {
        English: `\u26A0\uFE0F ${alertType.toUpperCase()} ALERT: Severe ${disasterType} threatening ${zone}. Move immediately to higher ground and designated emergency shelters. Keep phone lines open for emergencies. Follow instructions of RESQ rescue responders.`,
        Hindi: `\u26A0\uFE0F ${alertType.toUpperCase()} \u091A\u0947\u0924\u093E\u0935\u0928\u0940: ${zone} \u092E\u0947\u0902 \u0924\u0940\u0935\u094D\u0930 ${disasterType} \u0915\u093E \u0916\u0924\u0930\u093E\u0964 \u0924\u0941\u0930\u0902\u0924 \u090A\u0902\u091A\u0947 \u0938\u094D\u0925\u093E\u0928\u094B\u0902 \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0906\u0936\u094D\u0930\u092F\u094B\u0902 \u092E\u0947\u0902 \u091C\u093E\u090F\u0902\u0964 \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u0915\u0930\u094D\u092E\u093F\u092F\u094B\u0902 \u0915\u0947 \u0928\u093F\u0930\u094D\u0926\u0947\u0936\u094B\u0902 \u0915\u093E \u092A\u093E\u0932\u0928 \u0915\u0930\u0947\u0902\u0964`,
        Telugu: `\u26A0\uFE0F ${alertType.toUpperCase()} \u0C39\u0C46\u0C1A\u0C4D\u0C1A\u0C30\u0C3F\u0C15: ${zone} \u0C32\u0C4B \u0C24\u0C40\u0C35\u0C4D\u0C30\u0C2E\u0C48\u0C28 ${disasterType} \u0C2E\u0C41\u0C2A\u0C4D\u0C2A\u0C41. \u0C35\u0C46\u0C02\u0C1F\u0C28\u0C47 \u0C0E\u0C24\u0C4D\u0C24\u0C48\u0C28 \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C3E\u0C32\u0C15\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C41\u0C28\u0C30\u0C3E\u0C35\u0C3E\u0C38 \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C3E\u0C32\u0C15\u0C41 \u0C35\u0C46\u0C33\u0C4D\u0C32\u0C02\u0C21\u0C3F. \u0C38\u0C39\u0C3E\u0C2F\u0C15 \u0C38\u0C3F\u0C2C\u0C4D\u0C2C\u0C02\u0C26\u0C3F \u0C38\u0C42\u0C1A\u0C28\u0C32\u0C28\u0C41 \u0C2A\u0C3E\u0C1F\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F.`
      };
      if (!ai) {
        return res.json({
          message: defaultTemplates[language] || defaultTemplates["English"],
          channels: ["SMS", "Push Notification", "Email", "Web Broadcast", "Public Siren", "Digital Highway Signs"],
          estimatedReach: 24850,
          source: "simulated_engine"
        });
      }
      const prompt = `Write an official, high-urgency, clear, life-saving emergency broadcast message in ${language} for:
Alert Type: ${alertType}
Disaster: ${disasterType}
Affected Area: ${zone}
Keep it under 60 words, including emojis (\u26A0\uFE0F, \u{1F6A8}) and direct action instructions.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
      });
      res.json({
        message: response.text?.trim() || defaultTemplates[language] || defaultTemplates["English"],
        channels: ["SMS", "Push Notification", "Email", "Web Broadcast", "Public Siren", "Digital Highway Signs"],
        estimatedReach: 28400,
        source: "gemini-3.7-flash"
      });
    } catch (err) {
      res.json({
        message: `\u26A0\uFE0F EMERGENCY ${req.body.alertType?.toUpperCase() || "ALERT"}: Severe ${req.body.disasterType || "Disaster"} in ${req.body.zone || "Zone A"}. Evacuate immediately to designated relief shelters.`,
        channels: ["SMS", "Push Notification", "Public Siren"],
        estimatedReach: 19500,
        source: "fallback_engine"
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RESQ AI Emergency Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start RESQ AI Server:", err);
});
//# sourceMappingURL=server.cjs.map
