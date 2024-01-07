const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const event = require("../../db/models/event");
const { Op } = require('sequelize')

const router = express.Router();

// Returns all the events.
// Require Authentication: false
router.get('/', async (req , res ) => {

    let  { page , size } = req.query

    const pagination = {};

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    if (size <= 0) {
        size = 20; // default
      }

    page = page || 1; // default 1

    if (page < 1 || size < 1) {
     delete pagination.limit;
     delete pagination.offset;
   }

     const allEvents = await Event.scope('ex' , 'defaultScope').findAll({
        include: [
            {   
                model: Attendance
              },
              {
                model: Eventimage
              },
            {
                model: Group,
                attributes: ['id' , 'name' , 'city' , 'state']
            },
            {
              model: Venue,
              attributes:  ['id' , 'city' , 'state']
            },
        ]
     })

     let numAttending;
     let previewImage;

     let eventList = [];

     allEvents.forEach(event => {
        eventList.push(event.toJSON())
     })

     eventList.forEach(event => {

        event.numAttending = event.Attendances.length

        if (event.Eventimages && event.Eventimages.length > 0) {
            for (let image of event.Eventimages) {
                if (image.url){
                    event.previewImage = image.url;
                    break
                }
            }
        } else {
          event.previewImage  = 'no preview'
        }
        delete event.Attendances
        delete event.Eventimages
     })
    return res.json({Events: eventList})
})

// Get details of an Event specified by its id
// Require Authentication: false

router.get('/:eventId' , async (req , res ) => {

   const { eventId } = req.params

   const findEvent = await Event.scope('defaultScope').findByPk(eventId ,{
   
    include: [{
      model: Group,
      attributes: ['id' , 'name' , 'private' , 'city' , 'state']
    },
    {
      model: Venue,
      attributes: {
        exclude: ['groupId' , 'createdAt' , 'updatedAt']
      }
    },
     {
      model: Eventimage,
      attributes: {
        exclude: ['eventId' , 'createdAt' , 'updatedAt']
      }
    },
    {
      model: Attendance
    }
     ]
   })
  
   if (!findEvent){
    return res.status(404).json({"message": "Event couldn't be found"})
   }

   const arrayFlip = Array.isArray(findEvent) ? findEvent : [findEvent]; // check to see if an array if not flip since findbyPK is not an array


   let numAttending;

   let eventList = [];

   arrayFlip.forEach(event => {
      eventList.push(event.toJSON())
   })

   eventList.forEach(event => {

    event.numAttending = event.Attendances.length

    delete event.Attendances
 })
  return res.json(eventList)
})

// Add an Image to an Event based on the Event's id
// Require proper authorization: Current User must be an attendee, host, or co-host of the event
router.post('/:eventId/images' , requireAuth , async (req , res) => {
   
    const { eventId } = req.params

    const { url , preview } = req.body

    const currentEvent = await Event.findByPk(eventId, {
        include: { 
            model: Group, 
            attributes: ['id', 'organizerId'] }
    });
    
    if (!currentEvent){
       return res.status(404).json({"message": "Event couldn't be found"})
    }

    const groupId = currentEvent.Group.id

    // console.log(currentEvent.Group.organizerId)

    const checkHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (!(currentEvent.Group.organizerId === req.user.id || checkHost)){
        return res.status(403).json({ message: "You are not authorized for this action" });
       }

       const newImage = await Eventimage.create({
           eventId: eventId,
           url,
           preview
       })

       await newImage.save()

      return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

// Edit and returns an event specified by its id
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.put('/:eventId' , requireAuth , async (req , res ) => {

    const { eventId } = req.params

    const { venueId , name , type , capacity , price , description , startDate , endDate} = req.body

    const currentEvent = await Event.findByPk(eventId);

    if (!currentEvent){
      return res.status(404).json({"message": "Event couldn't be found"})
    }

    const groupId = currentEvent.groupId
    
    const currentGroup = await Group.findByPk(groupId)

    const currentVenue = await Venue.findByPk(venueId)
    
    // console.log('venue' , currentVenue)

    if (!currentVenue){
      return res.status(403).json({"message": "Venue couldn't be found" });
    }

    const checkHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (!(currentGroup.organizerId === req.user.id || checkHost)){
        return res.status(403).json({ message: "You are not authorized for this action" });
       }

       const arrayFlip = Array.isArray(currentEvent) ? currentEvent : [currentEvent]; // check to see if an array if not flip since findbyPK is not an array

       let eventList = [];

       arrayFlip.forEach(event => {
        eventList.push(event.toJSON())
       })

       eventList.forEach(event => {
        delete event.Group
      })

     if (venueId) currentEvent.venueId = venueId
     if (name) currentEvent.name = name
     if (type !== undefined) currentEvent.type = type
     if (capacity !== undefined) currentEvent.capacity = capacity
     if (price !== undefined) currentEvent.price = price
     if (description !== undefined) currentEvent.description = description
     if (startDate !== undefined) currentEvent.startDate = startDate
     if (endDate !== undefined) currentEvent.endDate = endDate

    await currentEvent.save(currentEvent)

     return res.json(eventList)
})

// Delete an event specified by its id
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.delete('/:eventId' , requireAuth, async (req , res ) => {

   const { eventId }  = req.params

   const currentEvent = await Event.findByPk(eventId , {
    include: { 
        model: Group, 
        attributes: ['id', 'organizerId'] }
});

   if (!currentEvent){
    return res.status(404).json({"message": "Event couldn't be found"})
    
   }

   const groupId = currentEvent.Group.id

   const checkHost = await Membership.findOne({
       where: {
           userId: req.user.id, 
           groupId, 
           status: 'co-host' }
   });

   if (!(currentEvent.Group.organizerId === req.user.id || checkHost)){
       return res.status(403).json({ message: "You are not authorized for this action" });
      }

     await currentEvent.destroy()

     return res.json({
        "message": "Successfully deleted"
      })

})

// Returns the attendees of an event specified by its id.
// Require Authentication: false
router.get('/:eventId/attendees' , async ( req , res ) => {
   const { eventId } = req.params
   
   const currentEvent = await Event.findByPk(eventId , {
    include: {
        model: Group,
        attributes: ['organizerId']
    }
   })

   if (!currentEvent){
   return res.status(404).json({
        "message": "Event couldn't be found"
      })
   }

   const checkHost = await Membership.findOne({
    where: {
        userId: req.user.id, 
        status: 'co-host' }
});

let currentAttendees = await Attendance.findAll({
    attributes: ['status'],
     include: {
        model: User,
        attributes: ['id' , 'firstName' , 'lastName'],
     }
})

  currentAttendees = currentAttendees.map(attendee => ({ // manually formatting the response
    id: attendee.User.id,
    firstName: attendee.User.firstName,
    lastName: attendee.User.lastName,
    Attendance: {
        status: attendee.status
    },
}));

if (!(currentEvent.Group.organizerId === req.user.id || checkHost)){
    
}
 return  res.json({Attendees: currentAttendees})
})

// Request attendance for an event specified by id.
// Require Authentication: true
//  Require Authorization: Current User must be a member of the group

router.post('/:eventId/attendance' , requireAuth , async (req , res ) => {
     
    const { eventId } = req.params

    const currentEvent = await Event.findByPk(eventId)

    const member = await Membership.findByPk(req.user.id)

    if (!member || member.status === 'pending'){
      return res.status(404).json({
        "message": "You are not authorized"
      })
    }
  
    if (!currentEvent){
      return res.status(404).json({
            "message": "Event couldn't be found"
          })
    }
  
      const attendance = await Attendance.findOne({
        where: {
            eventId,
            userId: req.user.id
        }
      })


   if (!attendance) {
    const newAttenders = await Attendance.create({
      eventId,
      userId: req.user.id,
      status: 'pending'
   })

   await newAttenders.save()

   return res.json({
      userId: newAttenders.userId,
      status: newAttenders.status
   })
   }
      if (attendance.status === 'pending'){
       return res.status(400).json({
            "message": "Attendance has already been requested"
          })
      } else if (attendance.status === 'attending'){
       return res.status(400).json({
             "message": "User is already an attendee of the event"
          })
      }

})

// Change the status of an attendance for an event specified by id.
// Require Authentication: true
// Require proper authorization: Current User must already be the organizer or have a membership to the group with the status of "co-host"
 router.put('/:eventId/attendance' , requireAuth , async (req , res ) => {
    
    const { eventId } = req.params

    const { userId , status } = req.body

    const currentEvent = await Event.findByPk(eventId)

    const currentGroup = await Group.findByPk(currentEvent.groupId)

    const currentUser = await User.findByPk(userId)

    if(!currentUser){
       return res.status(404).json({
            "message": "User couldn't be found"
          })
    }

   if (!currentEvent){
   return res.status(404).json({
        "message": "Event couldn't be found"
      })
   }

   const checkHost = await Membership.findOne({
    where: {
        groupId: currentEvent.id,
        userId: req.user.id,
        status: 'co-host'
    }
   })

   const currentAttendance = await Attendance.findOne({
    where: {
        userId,
        eventId 
    }
   })
   console.log(currentAttendance.id)

   if (!currentAttendance){
   return res.status(404).json({
        "message": "Attendance between the user and the event does not exist"
      })
   }

   if (status === 'pending'){
   return res.status(404).json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
              "status": "Cannot change an attendance status to pending"
            }
      })
   }

   if (checkHost || currentGroup.organizerId === req.user.id){
       if (userId) currentAttendance.userId = userId
       if (status) currentAttendance.status = status 

      await currentAttendance.save()

     return res.json({
        id: req.user.id,
        eventId: currentAttendance.eventId,
        userId: currentAttendance.userId,
        status: currentAttendance.status
     })
   } else {
       return res.status(403).json({"message": 'You are not authorized for this change'})
   }
 })

 // Delete an attendance to an event specified by id.
 // Require Authentication: true
 // Require proper authorization: Current User must be the host of the group, or the user whose attendance is being deleted

 router.delete('/:eventId/attendance/:userId' , requireAuth , async (req , res ) => {
   
    const { eventId  , userId } = req.params

    const currentUser = await User.findByPk(userId)

    const currentEvent = await Event.findByPk(eventId)

    const currentGroup = await Group.findByPk(currentEvent.groupId)

    const currentAttendance = await Attendance.findOne({
        where: {
            eventId,
            userId
        }
    })

    if (!currentUser){
       return res.status(404).json({"message": "User couldn't be found"})
    }

    if (!currentEvent){
      return  res.status(404).json({"message": "Event couldn't be found"})
    }

    if (!currentAttendance){
       return res.status(404).json({"message": "Attendance does not exist for this User"})
    }

    if (currentGroup.organizerId === req.user.id || userId === res.user.id){

        await currentAttendance.destroy()

        return res.json({
            "message": "Successfully deleted attendance from event"
          })
    } else {
       return res.status(403).json({"message": 'You are not authorized'})
    }

 })


module.exports = router;