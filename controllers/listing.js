const express = require('express');
const Listing = require('../models/listing');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
  } catch (err) {
    console.log(err);
    res.send('Error fetching listings');
  }
});

router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});

router.get('/', async (req, res) => {
  try {
    const populatedListings = await Listing.find({}).populate('owner');
    console.log('Populated Listings:', populatedListings);
    res.render('listing/index.ejs', {
      listings: populatedListings,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:listingId', async (req, res) => {
  try {
    const populatedListings = await Listing.findById(
      req.params.listingId
    ).populate('owner');

    res.render('listings/show.ejs', {
      listing: populatedListings,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    await Listing.create(req.body);
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
    res.send('Error creating listing');
  }
});

module.exports = router;
