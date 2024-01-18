const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");

const router = express.Router();

// Delete an existing image for a Group.
// Require Authentication: true
// Require proper authorization: Current user must be the organizer or "co-host" of the Group
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  
  try {

  let { imageId } = req.params

  imageId = +imageId
  
    const groupImage = await Groupimage.findByPk(imageId, {
      include: {
        model: Group
      },
    });

    if (!groupImage) {
      return res.status(404).json({ message: "Group Image couldn't be found" });
    }

    const group = groupImage.Group;
    
    if (group.organizerId !== req.user.id) {

      const isCoHost = await Membership.findOne({
        where: {
          groupId: group.id,
          userId: req.user.id,
          status: "co-host",
        },
      });

      if (!isCoHost) {
        return res.status(403).json({ message: "Not authorized to delete this image" });
      }
    }

    await groupImage.destroy();
     
    return res.status(200).json({ message: "Successfully deleted" });
    
  } catch (err) {

      next(err);
  }
});


module.exports = router;
