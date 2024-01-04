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




module.exports = router;