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

router.get('/:listingId/edit', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    res.render('listings/edit.ejs', {
      listing: currentListing,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
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

router.delete('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (listing.owner.equals(req.session.user._id)) {
      await listing.deleteOne();
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
