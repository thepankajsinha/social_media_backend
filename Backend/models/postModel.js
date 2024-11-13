import mongoose from "mongoose";

//create post schema

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//create post model and export

const Post = mongoose.model("Post", postSchema);

export default Post;