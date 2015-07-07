var mongoose = require('mongoose');
var blogpostSchema = new mongoose.Schema({
	title: String,
	created: { type: Date, default: Date.now },
	content: String,
	comments: [{ 
		author: String,
		posted: { type: Date, default: Date.now },
		body: String }],
});
mongoose.model('BlogPosts', blogpostSchema);