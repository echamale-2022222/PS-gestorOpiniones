import mongoose from "mongoose";

const PublicationSchema = mongoose.Schema({
    username:{
        type: String
    },
    title:{
        type: String,
        required: [true, "The title of the publication is mandatory"]
    },
    category:{
        type: String,
        required: [true, "The category of the publication is mandatory"]
    },
    maintext:{
        type: String,
        required: [true, "The main text is required"]
    },
    comments:[{
        usernameC: {
            type: String,
        },
        content: {
            type: String
        }
    }]
});

export default mongoose.model('Publication', PublicationSchema);