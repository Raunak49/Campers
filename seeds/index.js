const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images : [
                {
                    url:'https://res.cloudinary.com/dljetwzmt/image/upload/v1658658189/yelp%20camp/k6biid11y6clchnbbq3h.jpg',
                    filename: "yelp camp/k6biid11y6clchnbbq3h"
                },
                {
                    url:"https://res.cloudinary.com/dljetwzmt/image/upload/v1658658189/yelp%20camp/i4cfbwokm7lruuloy8zf.jpg",
                    filename: "yelp camp/i4cfbwokm7lruuloy8zf"
                }
            ],
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea libero ad sequi aspernatur voluptatibus, natus debitis quam consequatur quas in iste quod nesciunt officiis dignissimos quos? Rerum, magni fugit? Ducimus!',
            price: price,
            author: "62da8b2d18119979640d99d2"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}) 