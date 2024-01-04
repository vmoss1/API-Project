const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const {  Membership , Venue , Group} = require("../../db/models");

const router = express.Router();

// Edit a new venue specified by its id
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"

router.put('/:venueId' , requireAuth , async ( req, res ) => {

    const { venueId } = req.params
  
    const { address , city , state , lat ,lng } = req.body

    const currentVenue = await Venue.scope('defaultScope').findByPk(venueId)

    if (!currentVenue){
        res.status(404).json({"message": "Venue couldn't be found"})
    }

    const currentGroup = await Group.findByPk(currentVenue.groupId)

    const checkHost = await Membership.findOne({
         where: { 
            groupId: currentGroup.id,
             userId: req.user.id, 
             status: "co-host" } 
            })

    if (!(checkHost || currentGroup.organizerId === req.user.id)){
        res.status(404).json({"message": "You are not authorized"})
    }

    if (address) currentVenue.address = address
    if (city) currentVenue.city = city
    if (state) currentVenue.state = state
    if (lat) currentVenue.lat = lat
    if (lng) currentVenue.lng = lng

    await currentVenue.save()

    res.json(currentVenue)

})

module.exports = router;