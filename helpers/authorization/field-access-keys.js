// These objects store keys that are frequently sent to the select(../object.select.js) method for certain situations.
// Also used for select function in mongodb.

const ownerPermission = {
    User: {
        create: "-_id name email password title about website place",
        update: "-_id name title about website place",
        read: "-password -blocked -resetPassword"
    },
    Question: {
        create: "-_id title content",
        update: "-_id title content"
    },
    Answer: {
        create: "-_id content",
        update: "-_id content"
    }
};

const publicPermission = {
    User: {
        read: "-password -blocked -resetPassword",
        readAll: "name email role",
    },
    Question: {
        readAll: "-likes -answers",
    },
    Answer: {
        readAll: "-likes"
    }
};

module.exports = { ownerPermission, publicPermission };

