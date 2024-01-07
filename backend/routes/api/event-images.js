const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");

const router = express.Router();

router.delete('/:imageId' , requireAuth , async (req , res ) => {
   
    const { imageId } = req.params

    const eventImage = await Eventimage.findByPk(imageId)

    const member = await Membership.findByPk(req.user.id)

    if (!member || member.status === 'pending'){
      res.status(403).json({"message": "Event not found"})
    }

    const event = await Event.findByPk(eventImage.eventId , {
      include: {
        model: Group
      }
    })

    if (!event){
      res.status(404).json({"message": "Event not found"})
    }

    // const currentUser = await User.findByPk(req.user.id)

    // const group = await Group.findByPk(imageId)

    // console.log(groupImage)
  

  const checkHost = await Membership.findOne({
      where: {
          userId: req.user.id, 
          status: 'co-host' }
  });
  // console.log(req.user.id)

    if ((event.Group.organizerId === req.user.id || checkHost)){
       eventImage.destroy()

       return res.json({
          "message": "Successfully deleted"
       })
    } else {
      return res.status(403).json({ message: "You are not authorized for this action" });
    }

})


module.exports = router;