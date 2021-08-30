module.exports = (schema) => {
    schema.pre('findOneAndUpdate', setOptions);
}

function setOptions() {
    this.setOptions({ runValidators: true, new: true });
}