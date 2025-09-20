const express = require('express');
const Listing = require('../models/listing');
const router = express.Router();

// Index - show all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
  } catch (err) {
    console.log(err);
    res.send('Error fetching listings');
  }
});

// New - form for new listing
router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});

// Create - add new listing
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
