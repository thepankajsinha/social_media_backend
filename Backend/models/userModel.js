import mongoose from "mongoose";

//create a user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        default: ""
    },
    bannerImg:{
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: "ProConnect User"
    },
    location:{
        type: String,
        default: "Earth"
    },
    about:{
        type: String,
        default: "I am a ProConnect user"
    },
    skills:{
        type: [String],
    },
    experience:[
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String
        }
    ],
    education: [
        {
            school: String,
            fieldOfStudy: String,
            startYear: Number,
            endYear: Number
        }
    ],
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;