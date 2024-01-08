const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");

const router = express.Router();

router.delete('/:imageId' , requireAuth , async (req , res ) => {
   
  let { imageId } = req.params;

  imageId = +imageId

    const eventImage = await Eventimage.findByPk(imageId)

    if (!eventImage){
      return res.status(404).json({"message": "Event Image could not found"})
    }

    const event = await Event.findByPk(eventImage.eventId)

    const group = await Group.findByPk(event.groupId)

    if (!event){
     return res.status(404).json({"message": "Event not found"})
    }

    if (!group){
      return res.status(404).json({"message": "Group not found"})
    }

    const member = await Membership.findOne({
       where: { 
        userId: req.user.id, 
      }
     });

    if (!member || member.status === 'pending'){
     return res.status(403).json({"message": "Forbidden"})
    }

    if ((group.organizerId === req.user.id || member.status === 'co-host')) {
      await eventImage.destroy()

       return res.json({
          "message": "Successfully deleted"
       })
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

})


module.exports = router;