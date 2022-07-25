const Campground = require('../models/campground');
const mbxGeocoding  = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => { 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const c = new Campground(req.body.campground);
    c.geometry = geoData.body.features[0].geometry
    c.images = req.files.map(f => ({url: f.path, filename:f.filename}))
    c.author = req.user._id;
    await c.save();
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`campgrounds/${c._id}`);
}

module.exports.showCampground = async (req,res) => {
    const c = await Campground.findById(req.params.id).populate({
        path:'reviews', 
        populate: {
        path:'author'
        }
}).populate('author');
    if(!c) {
        req.flash('error', 'Cannot find that Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {c})
}

module.exports.renderEditForm = async (req,res) => {
    const c = await Campground.findById(req.params.id);
    if(!c) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {c})
}

module.exports.editCampground = async (req,res) => {
    const {id} = req.params;
    const c = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const img = req.files.map(f => ({url: f.path, filename:f.filename}))
    c.images.push(...img)
    await c.save();
    req.flash('success', 'Successfully edited Campground')
    res.redirect(`/campgrounds/${c._id}`);
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds');
}