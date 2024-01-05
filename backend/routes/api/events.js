const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");

const router = express.Router();

// Returns all the events.
// Require Authentication: false
router.get('/' , async (req , res ) => {

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
        }
        delete event.Attendances
        delete event.Eventimages
     })
     res.json({Events: eventList})
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
  res.json(eventList)
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
        res.status(404).json({"message": "Event couldn't be found"})
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

       const newImage = await Eventimage.create({
           url,
           preview
       })

       res.json({
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

    const currentEvent = await Event.findByPk(eventId , {
        include: { 
            model: Group, 
            attributes: ['id', 'organizerId'] }
    });

    if (!currentEvent){
        res.status(404).json({"message": "Event couldn't be found"})
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
     if (type) currentEvent.type = type
     if (capacity) currentEvent.capacity = capacity
     if (price) currentEvent.price = price
     if (description) currentEvent.description = description
     if (startDate) currentEvent.startDate = startDate
     if (endDate) currentEvent.endDate = endDate


     await currentEvent.save(currentEvent)

     res.json(eventList)
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

     res.json({
        "message": "Successfully deleted"
      })

})

module.exports = router;