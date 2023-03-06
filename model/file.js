import { FileSchema } from "../schema/index.js";

const file = {
    async create(payload) {
        try {
            const document = await new FileSchema(payload);
            await document.save();
            return document;
        } catch (err) {
            return err;
        }
    },
    async fetchByName(name) {
        try {
            const document = await FileSchema.findOne({ name });
            return document;
        } catch (err) {
            return err;
        }
    },
    async updateContent(name, content) {
        try {
            const document = await FileSchema.findOne({ name });
            if (!document) {
                return null;
            }
            document.content += content;
            await document.save();
            return document;
        } catch (err) {
            return err;
        }
    }
};

export default file;





