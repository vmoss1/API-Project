const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");

const router = express.Router();

// Delete an existing image for a Group.
// Require Authentication: true
// Require proper authorization: Current user must be the organizer or "co-host" of the Group
router.delete('/:imageId' , requireAuth , async (req , res ) => {
   
      const { imageId } = req.params

      const groupImage = await Groupimage.findByPk(imageId)

    //   const currentUser = await User.findByPk(req.user.id)

      const group = await Group.findByPk(imageId)

    //   console.log(groupImage)
      
      if (!groupImage){
       return res.status(404).json({"message": "Group Image couldn't be found"})
      }

    const checkHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            status: 'co-host' }
    });
    console.log(req.user.id)

      if ((group.organizerId === req.user.id || checkHost)){
         groupImage.destroy()

         return res.json({
            "message": "Successfully deleted"
         })
      } else {
        return res.status(403).json({ message: "You are not authorized for this action" });
      }

})


module.exports = router;
