const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Group, Membership, Eventimage, Event } = require("../../db/models");

const router = express.Router();

// Delete an existing image for an Event.
// Require Authentication: true
// Require proper authorization: Current user must be the organizer or "co-host" of the Group that the Event belongs to
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  try {
    let { imageId } = req.params;
    imageId = +imageId;

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
    const isOrganizer = group.organizerId === req.user.id;
    const isCoHost = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: req.user.id,
        status: "co-host",
      },
    });

    if (isCoHost || isOrganizer) {
      await eventImage.destroy();

      return res.status(200).json({ message: "Successfully deleted" });
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
