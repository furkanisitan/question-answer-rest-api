const mongoose = require("mongoose").plugin(require("./plugins/global"));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: [true, "Please provide a name"] },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email"
        ]
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please provide a password"],
        select: false
    },
    createdAt: { type: Date, default: Date.now },
    title: String,
    about: String,
    website: String,
    place: String,
    profileImage: { type: String, default: "default.jpg" },
    blocked: { type: Boolean, default: false },
    resetPassword: { token: String, expire: Date },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    like: {
        questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
        answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }]
    }
});

userSchema.methods.generateAccessToken = function () {

    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const payload = { id: this._id, name: this.name };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
};

userSchema.methods.generateResetPasswordToken = function () {

    const randomHexString = crypto.randomBytes(15).toString("hex");

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex");

    this.resetPassword.token = resetPasswordToken
    this.resetPassword.expire = Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
};

userSchema.pre("save", function (next) {

    if (!this.isModified("password")) return next();

    // password hashing 
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        return next();
    });
});

userSchema.post("remove", async function (doc, next) {

    await Question.deleteMany({ owner: this._id });
    await Answer.deleteMany({ owner: this._id });
    return next();
});

module.exports = mongoose.model("User", userSchema);

// circular dependency
const Question = require("./Question");
const Answer = require("./Answer");