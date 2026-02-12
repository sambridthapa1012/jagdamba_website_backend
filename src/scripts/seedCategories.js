import mongoose from "mongoose";
import Category from "./models/Category.js";

mongoose.connect(process.env.MONGO_URI);

await Category.insertMany([
  {
    name: "Cement & Construction",
    nameNepali: "सिमेन्ट र निर्माण",
    icon: "🏗️",
    image: "https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg",
    subcategories: ["Portland Cement", "Ready Mix Concrete"],
  },
  {
    name: "Paints & Colors",
    nameNepali: "रंग र रंगरोगन",
    icon: "🎨",
    image: "https://images.pexels.com/photos/7210275/pexels-photo-7210275.jpeg",
    subcategories: ["Interior Paint", "Exterior Paint"],
  },
]);
