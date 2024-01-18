const express = require("express");
const {  requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue , Attendance , Eventimage , Event} = require("../../db/models");
const membership = require("../../db/models/membership");
const venue = require("../../db/models/venue");

const router = express.Router();

//Returns all the groups.
//Require Authentication: false
router.get('/' , async (req , res , next ) => {
     
    try {
    const allGroups = await Group.unscoped().findAll({
        include: [
        {
            model: Membership
        } ,
        {
            model: Groupimage
        }
      ]
    })

    let groupList = []; // toJSON is not an array function used to iterate in order to manipulate

    allGroups.forEach(group => {
        groupList.push(group.toJSON())
    })

    groupList.forEach(group => {

      group.numMembers = group.Memberships.length; 
      
      if (group.Groupimages && group.Groupimages.length > 0) {
        for (let image of group.Groupimages) {
          if (image.url && image.preview === true) { // added logic to remove preview if not TRUE
            group.previewImage = image.url;
            break;  
          }
        }
      } else {
        group.previewImage = 'No preview'
  }
      delete group.Memberships // removing the unwanted models from the response body
      delete group.Groupimages
    })

    return res.json({'Groups': groupList})
} catch (err) {
    next(err)
}
})

// Get all Groups joined or organized by the Current User
// Require Authentication: true
router.get('/current' , requireAuth, async (req , res , next ) => {

    try {
  
const groupByCurrent = await Group.unscoped().findAll({
    where: {
        organizerId: req.user.id
    },
    include: [
    {
        model: Membership
    } ,
    { 
        model: Groupimage
   }
  ]
})

let groupList = [];

groupByCurrent.forEach(group => {
    groupList.push(group.toJSON())
})

groupList.forEach(group => {

  group.numMembers = group.Memberships.length; 

  if (group.Groupimages && group.Groupimages.length > 0) {
    for (let image of group.Groupimages) {
      if (image.url && image.preview === true) { // logic to only provide preview if TRUE
        group.previewImage = image.url;
        break;  
      }
    }
  } else {
    group.previewImage = 'No preview' // added so there is still a response in the body
}
  delete group.Memberships 
  delete group.Groupimages
})

return  res.json({Groups: groupList})
    } catch (err) {
        next(err)
    }

})

// Returns the details of a group specified by its id.
// Require Authentication: false
router.get('/:groupId' , async (req , res , next) => {

    try {
  
    let { groupId } = req.params

    groupId = +groupId // + ensures datatype is an number

    const groupedById = await Group.unscoped().findByPk(groupId , {
        include: [{
            model: Groupimage ,
            attributes: ['id' , 'url' , 'preview']
        } ,
        {
            model: Membership
        },
        {
        model: User ,
        as: 'Organizer',
        attributes: ['id' , 'firstName' , 'lastName']
        } , 
        { model: Venue}
         ]
    })

    if (!groupedById){
        return res.status(404).json({"message": "Group couldn't be found"})
    }
    
    const groupedByIdArray = Array.isArray(groupedById) ? groupedById : [groupedById]; // check to see if an array if not flip since findbyPK is not an array

    let groupList = [];
    // console.log(groupedByIdArray)
    groupedByIdArray.forEach(group => {

    groupList.push(group.toJSON())
 })

    groupList.forEach(group => {

      group.numMembers = group.Memberships.length; 

     delete group.Memberships 
 
})
    // reducing the array of objects into an object of objects
    const groupsObject = groupList.reduce((acc, group) => {

       acc[group.id] = group;
       return acc;
  });

   return res.json(groupsObject)
} catch (err) {
    next(err)
}

})

// Creates and returns a new group.
// Require Authentication: true
router.post('/', requireAuth , async  (req , res , next ) => {

    try {
   
    const { name , about , type , private , city , state } = req.body

    const newGroup = await Group.create({
        organizerId: req.user.id, // organizerId is the user who is creating the group
        name,
        about,
        type,
        private,
        city,
        state
    })

    await newGroup.save()

  return res.status(201).json(newGroup)
  } catch (err) {
    next(err)
  }
 
})

// Create and return a new image for a group specified by id.
// Require proper authorization: Current User must be the organizer for the group
router.post('/:groupId/images' , requireAuth , async (req , res , next) => {

    try {

    const { url , preview } = req.body

    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    if (!currentGroup){
      return  res.status(404).json({"message": "Group couldn't be found"})
    }
  
   if (currentGroup.organizerId !== req.user.id){
    return res.status(403).json({ "message": "Forbidden" });
   }

   const newImage = await Groupimage.create({
    groupId: groupId, // added groupId so image can be assigned to the correct groupId within in the get response
    url,
    preview
   })

   await newImage.save()
    
    return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
} catch (err) {
    next(err)
}
})

// Updates and returns an existing group.
// Require proper authorization: Group must belong to the current user
router.put('/:groupId' , requireAuth , async (req , res , next ) => {
    
    try {

    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.unscoped().findByPk(groupId)

     const { name , about , type , private , city , state } = req.body

     if (!currentGroup){
       return res.status(404).json({"message": "Group couldn't be found"})
    }
    // ensures that the current user is apart of the group by id
    if (currentGroup.organizerId !== req.user.id){
       return res.status(403).json({"message": "Forbidden"})
    } 

     if (name !== undefined) currentGroup.name = name
     if (about !== undefined) currentGroup.about = about
     if (type !== undefined) currentGroup.type = type
     if (private !== undefined) currentGroup.private = private // inputted !==undefined to ensure that the model validators work 
     if (city !== undefined) currentGroup.city = city
     if (state !== undefined) currentGroup.state = state

     await currentGroup.save()

    return res.json({
       id: currentGroup.id,
       organizerId: currentGroup.organizerId,
       name: currentGroup.name,
       about: currentGroup.about,
       type: currentGroup.type,
       private: currentGroup.private,
       city: currentGroup.city,
       state: currentGroup.state,
       createdAt: currentGroup.createdAt,
       updatedAt: currentGroup.updatedAt
     })
    } catch (err) {
        next(err)
    }
})

// Deletes an existing group.
// Require proper authorization: Group must belong to the current user
router.delete('/:groupId' , requireAuth , async (req , res , next ) => {

    try {

    let { groupId } = req.params;

    groupId = +groupId

    const deleteGroup = await Group.findByPk(groupId)

    if (!deleteGroup){
      return res.status(404).json({"message": "Group couldn't be found"})
    }

    if (deleteGroup.organizerId !== req.user.id){
      return res.status(403).json({"message": "Forbidden"})
    }

    await deleteGroup.destroy()

    return res.json({
        "message": "Successfully deleted"
      })
    } catch (err) {
        next(err)
    }
})

// Returns all venues for a group specified by its id
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.get('/:groupId/venues' , requireAuth , async (req , res , next ) => {

    try {

    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    const allVenues = await Venue.findAll({
        where: {
            groupId: groupId
        }
    })

    if (!currentGroup) {
      return  res.status(404).json({"message": "Group couldn't be found"})
    }

    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (!(currentGroup.organizerId === req.user.id || isCoHost)){
        return res.status(403).json({ message: "Forbidden" });
       }

    return res.json({Venues: allVenues })
    } catch (err) {
        next(err)
    }
})

// Creates and returns a new venue for a group specified by its id
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.post('/:groupId/venues' , requireAuth , async ( req , res , next ) => {

    try {

    const { address , city , state , lat ,lng } = req.body

    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    if (!currentGroup){
       return res.status(404).json({"message": "Group couldn't be found"})
    }

    const newVenue = await Venue.create({
        organizerId: req.user.id,
        groupId,
        address,
        city,
        state,
        lat,
        lng,
    })
    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (!(currentGroup.organizerId ===  req.user.id || isCoHost)){
        return res.status(403).json({ message: "Forbidden" });
       }

       await newVenue.save()

    return res.json({
        id: newVenue.id,
        organizerId: newVenue.organizerId,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng
    })
} catch (err) {
    next(err)
}
})

// Get all Events of a Group specified by its id
// Require Authentication: false
router.get('/:groupId/events' ,  async (req , res , next ) => {

    try {

    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    const eventByGroup = await Event.scope('defaultScope', 'ex').findAll({
        where: {
          groupId
        },
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
              attributes: ['id' , 'city' , 'state']
            },
        ]
    })

    if (!currentGroup){
       return res.status(404).json({"message": "Group couldn't be found"})
    }

   let eventList = [];

   eventByGroup.forEach(event => {
      eventList.push(event.toJSON())
   })

   eventList.forEach(event => {

      event.numAttending = event.Attendances.length

      if (event.Eventimages && event.Eventimages.length > 0) {
          for (let image of event.Eventimages) {
              if (image.url && image.preview === true){
                  event.previewImage = image.url;
                  break
              }
          }
      } else {
        event.previewImage = 'No preview'
  }
      delete event.Attendances
      delete event.Eventimages
   })
   
   return res.json({Events: eventList})

} catch (err) {
    next(err)
}
})

// Creates and returns a new event for a group specified by its id
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.post('/:groupId/events' , requireAuth , async (req , res , next) => {

    try {

    let { groupId } = req.params;

    groupId = +groupId

      const {venueId , name , type , capacity , price , description , startDate , endDate } = req.body

      const currentGroup = await Group.scope('defaultScope').findByPk(groupId)

      if (!currentGroup){
        return res.status(404).json({
            "message": "Group couldn't be found"
          })
      }

      const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (!(currentGroup.organizerId ===  req.user.id || isCoHost)){
        return res.status(403).json({ message: "Forbidden" });
       }

      const currentVenue = await Venue.findOne({
        where:{
            id: req.body.venueId
        }
      })

      if (!currentVenue){
        return res.status(404).json({
            "message": "Venue couldn't be found"
          })
      }

      if (!currentGroup){
        return res.status(404).json({
            "message": "Group couldn't be found"
          })
      }


       const newEvent = await Event.create({
          groupId,
          venueId,
          name,
          type,
          capacity,
          price,
          description,
          startDate,
          endDate
       })
   
      await newEvent.save()

     return  res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate
      })

    } catch (err) {
        next(err)
    }

})

// Returns the members of a group specified by its id.
// Require Authentication: false
// Successful Response: If you ARE the organizer or a co-host of the group. Shows all members and their statuses.
// Successful Response: If you ARE NOT the organizer of the group. Shows only members that don't have a status of "pending".
router.get('/:groupId/members' , async (req , res , next ) => {

    try {
 
    let { groupId } = req.params;

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    if (!currentGroup){
       return  res.status(404).json({"message": "Group couldn't be found"})
    }

    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    let memStatus; 
    if (!(currentGroup.organizerId ===  req.user.id || isCoHost)){
        memStatus =  ['co-host' , 'member']
    } else {
        memStatus = ['co-host' , 'member' , 'pending']
    }
    
       const currentMembers = await User.findAll({
        include: {
            model: Membership,
            attributes: ['status'],
            where: {
                groupId,
                status: memStatus
            }
        }
    })

    let memList = [];

    currentMembers.forEach(mem => {
        memList.push(mem.toJSON())
    })

    memList.forEach(mem => {
       
       mem.Membership = mem.Memberships

        delete mem.Memberships
    })

    return   res.json({Members: memList})
} catch (err) {
    next(err)
}
})

// Request a new membership for a group specified by id.
// Require Authentication: true
router.post('/:groupId/membership' , requireAuth , async (req , res , next ) => {

    try {
   
    let { groupId } = req.params

    groupId = +groupId

    const currentGroup = await Group.findByPk(groupId)

    if (!currentGroup){
       return res.status(404).json({"message": "Group couldn't be found"})
    }

    const member = await Membership.findOne({
        where: {
            groupId,
            userId: req.user.id
        }
    })
    // console.log(member)

   if(!member){

    const newMember = await Membership.create({
        userId: req.user.id,
        groupId,
        status: 'pending'
    })

    await newMember.save()

    const newestMember = await Membership.findOne({
        where: {
            userId: req.user.id
        }
    })

   return res.json({
        memberId: newestMember.userId,
        status: newestMember.status
    })
   } 

  if (member.status === 'member' || member.status === 'co-host'){
     return res.status(400).json({
        "message": "User is already a member of the group"
     });
  } else  {
   return res.status(400).json({
        "message": "Membership has already been requested"
     });
  }
} catch (err) {
    next(err)
}
})

// Change the status of a membership for a group specified by id.
// Require Authentication: true
// To change the status from "pending" to "member"
// Current User must already be the organizer or have a membership to the group
// change the status from "member" to "co-host
// Current User must already be the organizer
router.put('/:groupId/membership' , requireAuth , async (req , res, next) => {

    try {
    
    let { groupId  } = req.params

    groupId = +groupId

    const { status , memberId } = req.body

    const currentGroup = await Group.findByPk(groupId) // current group

    if (!currentGroup){
        return res.status(404).json({"message": "Group couldn't be found"})
    }

    const currentUser = await User.findByPk(memberId) // current user 

    if (!currentUser){
        return res.status(404).json({ "message": "User couldn't be found" })
    }
    
    const memberShip = await Membership.findOne({  // member needing to be changed
        where: {
            userId: memberId,
            groupId: groupId
        }
    })
    if (!memberShip){
       return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
          })
    }

    const currentMembership = await Membership.findOne({
        where: {
          groupId,
          userId: req.user.id
        },
      });

    const isCoHost = await Membership.findOne({
        where: {
            userId: req.user.id, 
            groupId, 
            status: 'co-host' }
    });

    if (status === 'pending'){
      return  res.status(400).json({
            "message": "Bad Request",  
            "errors": {
              "status": "Cannot change a membership status to pending"
            }
          })
    }

    const isOrganizer = currentGroup.organizerId === req.user.id
    const isMember = currentMembership
    const isChangingFromPendingToMember = status === 'member'
    const isChangingFromMemberToCoHost = status === 'co-host'

    if (isOrganizer && isChangingFromMemberToCoHost){
        if (status) memberShip.status = status
        await memberShip.save()
        //   console.log("UPDATED 1" , updatedMember)
          return res.json({
            id: memberShip.id,
            groupId,
            memberId,
            status,
          })
    } else if ((isOrganizer || (isMember && isCoHost)) && isChangingFromPendingToMember){
        if (status) memberShip.status = status
        await memberShip.save()
    //   console.log("UPDATED 2" , updatedMember)
      return res.json({
             id: memberShip.id,
             groupId,
             memberId,
             status,
           })
    } else {
       return res.status(403).json({"message": "Forbidden"})
    }

    // if ((currentGroup.organizerId === req.user.id || isCoHost) && status === 'member' ){
    //    if (memberId) currentMember.memberId = memberId
    //    if (status) currentMember.status = status
    //    await currentMember.save()
    //    return res.json({
    //      id: currentGroup.id,
    //      groupId,
    //      memberId,
    //      status,
    //    })
    // } else if (!(currentGroup.organizerId === req.user.id || isCoHost) && status === 'member' ) {
    //    return res.status(403).json({"message": "Forbidden"})
    // }

    // if (currentGroup.organizerId === req.user.id || status === 'co-host'){
    //     if (memberId) currentMember.memberId = memberId
    //     if (status) currentMember.status = status
    //     await currentMember.save()
    //     return res.json({
    //       id: currentGroup.id,
    //       groupId,
    //       memberId,
    //       status,
    //     })
    // } else if (!(currentGroup.organizerId === req.user.id) && status === 'co-host') {
    //   return  res.status(403).json({"message": "Forbidden"})
    // }
} catch (err) {
    next(err)
}
})

// Delete a membership to a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the host of the group, or the user whose membership is being deleted
router.delete('/:groupId/membership/:memberId' , requireAuth , async (req , res , next) => {

    try {

    let { groupId , memberId  } = req.params

    groupId = +groupId
    memberId = +memberId


    const currentGroup  = await Group.findByPk(groupId)

    if (!currentGroup) {   
        return res.status(404).json({"message": "Group couldn't be found"})
        }

    const currentUser = await User.findByPk(memberId)

    if (!currentUser){
      return  res.status(404).json({"message": "Member couldn't be found"})
    }

    const currentMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    })

   if (!currentMembership){
  return res.status(404).json({"message": "Membership does not exist for this User"})
   }


   if ( currentGroup.organizerId === req.user.id || currentMembership.userId === req.user.id){
   await currentMembership.destroy()
    return res.json({ "message": "Successfully deleted membership from group"})
   } else {
    return res.status(403).json({"message": "Forbidden"})
   }
} catch (err) {
    next(err)
}
})


module.exports = router;