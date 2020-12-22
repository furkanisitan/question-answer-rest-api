const pickOmit = require("object.pickomit").setDefaultPicks('_id');
const CustomError = require("../helpers/error/CustomError");
const { sendEmail } = require("../helpers/libraries/email");
const { ownerPermission } = require("../helpers/authorization/field-access-keys");
const { User, Question, Answer } = require("../models");

const accountController = {

    /**
     * get logged in user
     */
    get: async (req, res, next) => {

        // req.user => get from JWTAuth middleware
        const user = await User.findById(req.user.id).select(ownerPermission.User.read);
        res.json({ success: true, data: user });
    },

    /**
     * update logged in user
     */
    update: async (req, res, next) => {

        // req.user => get from JWTAuth middleware
        const data = pickOmit.select(req.body, ownerPermission.User.update);
        const user = await User.findByIdAndUpdate(req.user.id, data).select(ownerPermission.User.read);
        res.json({ success: true, message: "Update successful.", data: user });
    },

    /**
     * upload image of logged in user
     */
    uploadImage: async (req, res, next) => {

        // req.user => get from JWTAuth middleware
        // req.savedImage => get from photoUpload middleware
        await User.findByIdAndUpdate(req.user.id, { profileImage: req.savedImage });
        res.json({ success: true, message: "Image upload successful." });
    },

    recoveryGet: async (req, res, next) => {

        res.send(`
<p>To reset the password, send a put request as below.</p>
<pre>
PUT /api/v1/account/recovery?rpt={resetPasswordToken}
Content-Type: application/json
{
    "password":"newPassword"
}
</pre>
        `);
    },

    recovery: async (req, res, next) => {

        // check email exist
        const resetEmail = req.body.email;
        const user = await User.findOne({ email: resetEmail });
        if (!user)
            return next(new CustomError("User with this email was not found.", 404));

        const rpt = user.generateResetPasswordToken();
        const resetPasswordUrl = `${process.env.API_ABSOLUTE_URL}/account/recovery?rpt=${rpt}`;
        const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This link will expire in 1 hour</p>
        <a href = '${resetPasswordUrl}' target = '_blank'>${resetPasswordUrl}</a>`;

        try {
            // send email
            await sendEmail({
                from: process.env.SMTP_EMAIL,
                to: resetEmail,
                subject: "Password Reset Link",
                html: emailTemplate
            });

            // update resetPassword
            await user.save();

            return res.json({ success: true, message: "Sent password reset link to email address." });

        } catch (err) {
            return next(new CustomError("An error occurred while sending mail.", 500));
        }
    },

    resetPassword: async (req, res, next) => {

        // rpt => reset password token
        const { rpt } = req.query;
        const { password } = req.body;

        if (!rpt) return next(new CustomError("Invalid token.", 400));

        // $gt => grater than
        let user = await User.findOne({
            'resetPassword.token': rpt,
            'resetPassword.expire': { $gt: Date.now() }
        });

        if (!user) return next(new CustomError("The token is incorrect or has expired.", 401));

        // update
        user.password = password;
        user.resetPassword = undefined;
        await user.save();

        return res.json({ success: true, message: "Password reset successful." });
    },

    getAllQuestions: async (req, res, next) => {

        const questions = await Question.find({ owner: req.user.id });
        res.json({ success: true, data: questions });
    },

    getAllAnswers: async (req, res, next) => {
        const answers = await Answer.find({ owner: req.user.id });
        res.json({ success: true, data: answers });
    }
};

module.exports = accountController;
