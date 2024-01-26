const express = require("express");
const { requireAuth } = require("../../utils/auth");
const {
  Group,
  Membership,
  User,
  Venue,
  Attendance,
  Eventimage,
  Event,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Validation middleware for pagination
const validatePagination = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),

  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  handleValidationErrors,
];

// Returns all the events.
// Require Authentication: false
router.get("/", validatePagination, async (req, res, next) => {
  try {
    // sets defaults
    let { page = 1, size = 20 } = req.query;

    // isNaN ensures that the code behaves even when dealing with an unexpected input
    // ensures that size is limited to a maximum value of 20 and 10

    page = isNaN(page) || page <= 0 ? 1 : (parseInt(page), 10);
    size = isNaN(size) || size <= 0 ? 20 : Math.min(parseInt(size), 20);

    const allEvents = await Event.scope("ex", "defaultScope").findAll({
      include: [
        {
          model: Attendance,
        },
        {
          model: Eventimage,
        },
        {
          model: Group,
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          attributes: ["id", "city", "state"],
        },
      ],
      offset: size * (page - 1), // Calculate offset based on page and size
      limit: size, // Set the limit to the specified size
    });

    let eventList = [];

    allEvents.forEach((event) => {
      eventList.push(event.toJSON());
    });

    eventList.forEach((event) => {
      event.numAttending = event.Attendances.length;

      if (event.Eventimages && event.Eventimages.length > 0) {
        for (let image of event.Eventimages) {
          if (image.url && image.preview === true) {
            event.previewImage = image.url;
            break;
          }
        }
      } else {
        event.previewImage = "no preview";
      }
      delete event.Attendances;
      delete event.Eventimages;
    });

    return res.json({ Events: eventList });
  } catch (err) {
    next(err);
  }
});

// Get details of an Event specified by its id
// Require Authentication: false

router.get("/:eventId", async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const findEvent = await Event.scope("defaultScope").findByPk(eventId, {
      include: [
        {
          model: Group,
          attributes: ["id", "name", "private", "city", "state"],
        },
        {
          model: Venue,
          attributes: {
            exclude: ["groupId", "createdAt", "updatedAt"],
          },
        },
        {
          model: Eventimage,
          attributes: {
            exclude: ["eventId", "createdAt", "updatedAt"],
          },
        },
        {
          model: Attendance,
        },
      ],
    });

    if (!findEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const eventArray = Array.isArray(findEvent) ? findEvent : [findEvent]; // check to see if an array if not flip since findbyPK is not an array

    let eventList = [];

    eventArray.forEach((event) => {
      eventList.push(event.toJSON());
    });

    eventList.forEach((event) => {
      event.numAttending = event.Attendances.length;

      delete event.Attendances;
    });

    // reducing the array of objects into an object of objects
    const EventObject = eventList.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    });

    return res.json(EventObject);
  } catch (err) {
    next(err);
  }
});

// Add an Image to an Event based on the Event's id
// Require proper authorization: Current User must be organizer || cohost
//   of the event cannot be a non member or membership is pending
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const { url, preview } = req.body;

    const currentEvent = await Event.findByPk(eventId, {
      include: {
        model: Group,
        attributes: ["id", "organizerId"],
      },
    });

    if (!currentEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const groupId = currentEvent.Group.id;

    const isCoHost = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId,
        status: "co-host",
      },
    });

    const isAttending = await Attendance.findOne({
      where: {
        eventId,
        userId: req.user.id,
        status: "attending",
      },
    });

    const isOrganizer = currentEvent.Group.organizerId === req.user.id;

    if (!(isOrganizer || isCoHost || isAttending)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newImage = await Eventimage.create({
      eventId: eventId,
      url,
      preview,
    });

    await newImage.save();

    return res.json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (err) {
    next(err);
  }
});

// Edit and returns an event specified by its id
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.put("/:eventId", requireAuth, async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const currentEvent = await Event.findByPk(eventId);

    if (!currentEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const groupId = currentEvent.groupId;

    const currentGroup = await Group.findByPk(groupId);

    const currentVenue = await Venue.findByPk(venueId);

    if (!currentVenue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const isCoHost = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId,
        status: "co-host",
      },
    });

    const isOrganizer = currentGroup.organizerId === req.user.id;

    if (!(isOrganizer || isCoHost)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const eventArray = Array.isArray(currentEvent)
      ? currentEvent
      : [currentEvent]; // check to see if an array if not flip since findbyPK is not an array

    let eventList = [];

    eventArray.forEach((event) => {
      eventList.push(event.toJSON());
    });

    eventList.forEach((event) => {
      delete event.Group;
    });

    if (venueId) currentEvent.venueId = venueId;
    if (name) currentEvent.name = name;
    if (type !== undefined) currentEvent.type = type;
    if (capacity !== undefined) currentEvent.capacity = capacity;
    if (price !== undefined) currentEvent.price = price;
    if (description !== undefined) currentEvent.description = description;
    if (startDate !== undefined) currentEvent.startDate = startDate;
    if (endDate !== undefined) currentEvent.endDate = endDate;

    await currentEvent.save(currentEvent);

    const editedEvent = await Event.findByPk(eventId);

    return res.json(editedEvent);
  } catch (err) {
    next(err);
  }
});

// Delete an event specified by its id
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.delete("/:eventId", requireAuth, async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const currentEvent = await Event.findByPk(eventId, {
      include: {
        model: Group,
        attributes: ["id", "organizerId"],
      },
    });

    if (!currentEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const groupId = currentEvent.Group.id;

    const isCoHost = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId,
        status: "co-host",
      },
    });

    const isOrganizer = currentEvent.Group.organizerId === req.user.id;

    if (!(isOrganizer || isCoHost)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await currentEvent.destroy();

    return res.json({
      message: "Successfully deleted",
    });
  } catch (err) {
    next(err);
  }
});

// Returns the attendees of an event specified by its id.
// Require Authentication: false
router.get("/:eventId/attendees", async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const currentEvent = await Event.findByPk(eventId, {
      include: {
        model: Group,
        attributes: ["organizerId"],
      },
    });

    if (!currentEvent) {
      return res.status(404).json({
        message: "Event couldn't be found",
      });
    }

    const isCoHost = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId: currentEvent.groupId,
        status: "co-host",
      },
    });

    let currentAttendees = await Attendance.findAll({
      attributes: ["status"],
      where: {
        eventId: eventId,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });

    formattedAttendees = currentAttendees.map((attendee) => ({
      // manually formatting the response
      id: attendee.User.id,
      firstName: attendee.User.firstName,
      lastName: attendee.User.lastName,
      Attendance: {
        status: attendee.status,
      },
    }));

    const isOrganizer = currentEvent.Group.organizerId === req.user.id;

    if (!(isOrganizer || isCoHost)) {
      let filteredAttendees = formattedAttendees.filter((attendee) => {
        return attendee.Attendance.status !== "pending";
      });
      return res.json({ Attendees: filteredAttendees });
    } else {
      return res.json({ Attendees: formattedAttendees });
    }
  } catch (err) {
    next(err);
  }
});

// Request attendance for an event specified by id.
// Require Authentication: true
//  Require Authorization: Current User must be a member of the group
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const currentEvent = await Event.findByPk(eventId);

    if (!currentEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const member = await Membership.findOne({
      where: {
        groupId: currentEvent.groupId,
        userId: req.user.id,
      },
    });

    if (!member || member.status === "pending") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const attendance = await Attendance.findOne({
      where: {
        eventId,
        userId: req.user.id,
      },
    });

    if (!attendance) {
      const newAttenders = await Attendance.create({
        eventId,
        userId: req.user.id,
        status: "pending",
      });

      await newAttenders.save();

      let updatedAttender = await Attendance.findOne({
        where: {
          eventId,
          userId: req.user.id,
        },
      });

      return res.json({
        userId: updatedAttender.userId,
        status: updatedAttender.status,
      });
    }
    if (attendance.status === "pending") {
      return res
        .status(400)
        .json({ message: "Attendance has already been requested" });
    } else if (attendance.status === "attending") {
      return res
        .status(400)
        .json({ message: "User is already an attendee of the event" });
    }
  } catch (err) {
    next(err);
  }
});

// Change the status of an attendance for an event specified by id.
// Require Authentication: true
// Require proper authorization: Current User must already be the organizer or have a membership to the group with the status of "co-host"
router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
  try {
    let { eventId } = req.params;

    eventId = +eventId;

    const { userId, status } = req.body;

    const currentEvent = await Event.findByPk(eventId);

    if (!currentEvent) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const currentUser = await User.findByPk(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    const currentGroup = await Group.findByPk(currentEvent.groupId);

    const isCoHost = await Membership.findOne({
      where: {
        groupId: currentGroup.id,
        userId: req.user.id,
        status: "co-host",
      },
    });

    const currentAttendance = await Attendance.findOne({
      where: {
        userId,
        eventId,
      },
    });

    if (!currentAttendance) {
      return res.status(404).json({
        message: "Attendance between the user and the event does not exist",
      });
    }

    //  console.log(currentAttendance.id)
    if (status === "pending") {
      return res.status(400).json({
        message: "Bad Request", // (or "Validation error" if generated by Sequelize),
        errors: {
          status: "Cannot change an attendance status to pending",
        },
      });
    }

    let isOrganizer = currentGroup.organizerId === req.user.id;

    if (isCoHost || isOrganizer) {
      currentAttendance.status = status;

      await currentAttendance.save();

      return res.json({
        id: currentAttendance.id,
        eventId: currentAttendance.eventId,
        userId: currentAttendance.userId,
        status: currentAttendance.status,
      });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    next(err);
  }
});

// Delete an attendance to an event specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer of the group, or the user whose attendance is being deleted

router.delete(
  "/:eventId/attendance/:userId",
  requireAuth,
  async (req, res, next) => {
    try {
      let { eventId, userId } = req.params;

      eventId = +eventId;
      userId = +userId;

      const currentEvent = await Event.findByPk(eventId);

      if (!currentEvent) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const currentUser = await User.findByPk(userId);

      if (!currentUser) {
        return res.status(404).json({ message: "User couldn't be found" });
      }

      const currentGroup = await Group.findByPk(currentEvent.groupId);

      if (!currentGroup) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      const isOrganizer =
        currentGroup && currentGroup.organizerId === req.user.id;
      const notCurrentAttender = userId !== req.user.id;

      if (!isOrganizer && notCurrentAttender) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const attendanceToDelete = await Attendance.findOne({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });

      if (!attendanceToDelete) {
        return res
          .status(404)
          .json({ message: "Attendance does not exist for this User" });
      }

      await attendanceToDelete.destroy();

      return res.json({
        message: "Successfully deleted attendance from event",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
