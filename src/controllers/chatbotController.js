// import OpenAI from "openai";
// import Product from "../models/Product.js";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const chatWithAI = async (req, res) => {
//   try {
//     const { message } = req.body;

//     // Fetch products for AI context
//     const products = await Product.find().select("name price category description");

//     const productContext = products
//       .map(
//         (p) =>
//           `Product: ${p.name}, Price: NPR ${p.price}, Category: ${p.category}, Description: ${p.description}`
//       )
//       .join("\n");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a helpful AI assistant for a hardware/building materials store.
// Answer only based on the product list below.
// If a product is not found, politely say so.

// PRODUCT LIST:
// ${productContext}
//           `,
//         },
//         { role: "user", content: message },
//       ],
//     });

//     res.json({
//       success: true,
//       reply: completion.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error("AI Chat Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "AI service unavailable",
//     });
//   }
// };
