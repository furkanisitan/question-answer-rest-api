const mongoose = require("mongoose").plugin(require("./plugins/global"));

const { Schema } = mongoose;

const answerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [20, "Please provide content at least 20 characters"]
    },
    createdAt: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    question: { type: mongoose.Schema.ObjectId, ref: "Question", required: true },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0, min: 0 }
});

answerSchema.pre("save", async function (next) {

    if (this.isNew) {

        // add ref to owner and question
        await Promise.all([
            User.findByIdAndUpdate(this.owner, { $addToSet: { answers: this._id } }),
            Question.findByIdAndUpdate(this.question, {
                $addToSet: { answers: this._id },
                $inc: { answerCount: 1 }
            })
        ]);
    }
});

answerSchema.post("remove", async function (doc) {

    // remove ref from owner and question
    await Promise.all([
        User.findByIdAndUpdate(this.owner, { $pull: { answers: this._id } }),
        Question.findByIdAndUpdate(this.question, {
            $pull: { answers: this._id },
            $inc: { answerCount: -1 }
        })
    ]);

});

answerSchema.methods.like = async function (like, answer, userId) {

    // like
    if (like) {
        answer.likes.addToSet(userId);
        await User.findByIdAndUpdate(userId, { $addToSet: { 'like.answers': answer._id } });
    }
    // undo like
    else {
        answer.likes.pull(userId);
        await User.findByIdAndUpdate(userId, { $pull: { 'like.answers': answer._id } });
    }
    answer.likeCount = answer.likes.length;
    return await answer.save();
};

module.exports = mongoose.model("Answer", answerSchema);

// circular dependency
const Question = require("./Question");
const User = require("./User");