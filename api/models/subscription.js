const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topic: { type: String, required: true },
    url: { type: String, required: true, match: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);