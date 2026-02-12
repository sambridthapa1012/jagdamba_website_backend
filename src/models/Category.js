import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameNepali: String,
  icon: String,
  image: {
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
},

  subcategories: [String],
});

export default mongoose.model("Category", categorySchema);
