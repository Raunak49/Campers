const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReview = async (req,res) => {
    const c = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    c.reviews.push(review)
    await review.save();
    await c.save();
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.deleteReview = async (req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    res.redirect(`/campgrounds/${id}`)
}