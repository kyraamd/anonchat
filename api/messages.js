import { fetchMessages, saveMessages } from "./github.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const messages = await fetchMessages();
      return res.status(200).json(messages);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text required" });

      let messages = await fetchMessages();
      const newMsg = { id: Date.now(), text };
      messages.push(newMsg);

      await saveMessages(messages);

      return res.status(201).json(newMsg);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
