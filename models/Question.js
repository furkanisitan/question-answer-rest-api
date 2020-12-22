const mongoose = require("mongoose").plugin(require("./plugins/global"));
const slugify = require("slugify");

const { Schema } = mongoose;

const questionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [10, "Please provide title at least 10 characters"],
        unique: true
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [20, "Please provide content at least 20 characters"]
    },
    slug: String,
    createdAt: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0, min: 0 },
    answers: [{ type: mongoose.Schema.ObjectId, ref: 'Answer' }],
    answerCount: { type: Number, default: 0, min: 0 },
});

questionSchema.pre("save", async function (next) {

    // title slug
    if (this.isModified("title"))
        this.slug = this.getSlug();

    // add ref to owner
    if (this.isNew)
        await User.findByIdAndUpdate(this.owner, { $addToSet: { questions: this._id } });

    return next();
});

questionSchema.post("remove", async function (doc) {

    await User.findByIdAndUpdate(this.owner, { $pull: { questions: this._id } });
});

questionSchema.methods.getSlug = function () {
    return slugify(this.title, { remove: /[*+~.()'"!:@]/g, lower: true, });
};

questionSchema.methods.like = async function (like, question, userId) {

    // like
    if (like) {
        question.likes.addToSet(userId);
        await User.findByIdAndUpdate(userId, { $addToSet: { 'like.questions': question._id } });
    }
    // undo like
    else {
        question.likes.pull(userId);
        await User.findByIdAndUpdate(userId, { $pull: { 'like.questions': question._id } });
    }
    question.likeCount = question.likes.length;
    return await question.save();
};

module.exports = mongoose.model("Question", questionSchema);

// circular dependency
const User = require("./User");