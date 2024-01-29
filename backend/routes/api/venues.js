const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Membership, Venue, Group } = require("../../db/models");

const router = express.Router();

// Edit a new venue specified by its id
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.put("/:venueId", requireAuth, async (req, res, next) => {
  try {
    let { venueId } = req.params;
    venueId = +venueId;

    const { address, city, state, lat, lng } = req.body;

    const currentVenue = await Venue.findByPk(venueId);
    if (!currentVenue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const currentGroup = await Group.findByPk(currentVenue.groupId);

    const isCoHost = await Membership.findOne({
      where: {
        groupId: currentGroup.id,
        userId: req.user.id,
        status: "co-host",
      },
    });
    const isOrganizer = currentGroup.organizerId === req.user.id;
    if (!(isCoHost || isOrganizer)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (address !== undefined) currentVenue.address = address;
    if (city !== undefined) currentVenue.city = city;
    if (state !== undefined) currentVenue.state = state;
    if (lat !== undefined) currentVenue.lat = lat;
    if (lng !== undefined) currentVenue.lng = lng;

    await currentVenue.save();

    return res.json({
      id: currentVenue.id,
      groupId: currentVenue.groupId,
      address: currentVenue.address,
      city: currentVenue.city,
      state: currentVenue.state,
      lat: currentVenue.lat,
      lng: currentVenue.lng,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
