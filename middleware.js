const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Campground = require('./models/campground')
const Review = require('./models/review')
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
                
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
    {next();}
}
module.exports.isAuthor = async (req,  res, next) => {
    const {id} = req.params;
    const c = await Campground.findById(id)
    if(!c.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.isReviewAuthor = async (req,  res, next) => {
    const {id, reviewId} = req.params;
    const r = await Review.findById(reviewId)
    if(!r.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
    next();
    }
}
/*method-override@3.0.0
├── mongoose@6.4.4
├── passport-local-mongoose@7.1.2
├── passport-local@1.0.0
├── passport@0.6.0
└── session@0.1.0*/   