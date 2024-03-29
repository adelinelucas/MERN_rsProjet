import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required:true
        },
        message: {
            type: String,
            required: true,
            maxlength:500,
            trim: true
        }, 
        picture: {
            type: String,
        },
        video: {
            type: String
        },
        likers: {
            type: [String],
            required: true,
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            required: true,
        }
    }, 
    {
        timestamps: true,
    }
)

export default mongoose.model('post', PostSchema);