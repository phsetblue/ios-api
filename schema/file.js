import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
});

export default mongoose.model('file', fileSchema, 'file');