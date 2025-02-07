const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const Tasks = mongoose.model('tasks', taskSchema);
module.exports = Tasks;