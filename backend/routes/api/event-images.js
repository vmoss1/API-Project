const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");

const router = express.Router();

router.delete('/:imageId' , requireAuth , async (req , res ) => {
  
  try {
   let { imageId } = req.params;

   imageId = +imageId

    const eventImage = await Eventimage.findByPk(imageId, {
      include: {
        model: Event,
        include: {
          model: Group,
        },
      },
    });

    if (!eventImage) {
      return res.status(404).json({ message: "Event Image couldn't be found" });
    }

    const group = eventImage.Event.Group;
    //if not the catch will catch the other errors
    if (group.organizerId !== req.user.id) {
      
      const isCoHost = await Membership.findOne({
        where: {
          groupId: group.id,
          userId: req.user.id,
          status: "co-host",
        },
      });

      if (!isCoHost) {
        return res.status(403).json({ "message": "Forbidden" });
      }
    }

        await eventImage.destroy();

       return res.status(200).json({ message: "Successfully deleted" });
        
  } catch (err) {
     
       next(err);
  }
})


module.exports = router;