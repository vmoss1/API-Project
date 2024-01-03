const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group , Membership , Groupimage , User , Venue} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { CustomCondition } = require("express-validator/src/context-items");

const router = express.Router();

router.get('/' , async (req , res ) => {

    // const numMembers = Membership.length
    // console.log(numMembers)

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

    let numMembers;
    let previewImage;
     
    let groupList = []; // toJSON is not an array function used to iterate in order to manipulate
    allGroups.forEach(group => {
        groupList.push(group.toJSON())
    })

    groupList.forEach(group => {

      group.numMembers = group.Memberships.length; 
      
      if (group.Groupimages && group.Groupimages.length > 0) {
        for (let image of group.Groupimages) {
          if (image.url) {
            group.previewImage = image.url;
            break;  
          }
        }
      }
      delete group.Memberships 
      delete group.Groupimages
    })
    res.json({'Groups': groupList})
})

router.get('/current' , requireAuth , async (req , res ) => {

    const { user } = req
  
const groupByCurrent = await Group.unscoped().findAll({
    where: {
        organizerId: user.id
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

let numMembers;
let previewImage;
 
let groupList = [];
groupByCurrent.forEach(group => {
    groupList.push(group.toJSON())
})

groupList.forEach(group => {

  group.numMembers = group.Memberships.length; 
  
  if (group.Groupimages && group.Groupimages.length > 0) {
    for (let image of group.Groupimages) {
      if (image.url) {
        group.previewImage = image.url;
        break;  
      }
    }
  }
  delete group.Memberships 
  delete group.Groupimages
})

  res.json({Groups: groupList})

})

router.get('/:groupId' , async (req , res) => {
  
    const { groupId } = req.params

    const groupedById = await Group.findByPk(groupId , {
        include: [{
            model: Groupimage ,
            attributes: ['id' , 'url' , 'preview']
        } ,
        {
        model: User ,
        as: 'Organizer', attributes: ['id' , 'firstName' , 'lastName']
        } , 
        { model: Venue}
         ]
    })
    if (!groupId){
        return res.status(404).json({"message": "Group couldn't be found"})
    }

    res.json(groupedById)


})

router.post('/', requireAuth , async  (req , res ) => {
   
    const { name , about , type , private , city , state } = req.body

    const newGroup = await Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    })

    res.json(newGroup)

})

router.post('/:groupId/images' , requireAuth , async (req , res) => {

    const { url , preview } = req.body

    const { groupId } = req.params;

    const currentGroup = await Group.findByPk(groupId)

    if (!currentGroup){
        res.status(404).json({"message": "Group couldn't be found"})
    }

    res.json({
        id: groupId,
        url,
        preview
    })
})

router.put('/:groupId' , requireAuth , async (req , res ) => {

    const { groupId } = req.params;

    const currentGroup = await Group.unscoped().findByPk(groupId)

     const {name , about , type , private , city , state } = req.body

     if (!currentGroup){
        res.status(404).json({"message": "Group couldn't be found"})
    }

     if (name) currentGroup.name = name
     if (about) currentGroup.about = about
     if (type) currentGroup.type = type
     if (private) currentGroup.private = private
     if (city) currentGroup.city = city
     if (state) currentGroup.state = state

     await currentGroup.save()

     res.json(currentGroup)
})

router.delete('/:groupId' , requireAuth , async (req , res ) => {

    const { groupId } = req.params

    const deleteGroup = await Group.findByPk(groupId)

    if (!deleteGroup){
        res.status(404).json({"message": "Group couldn't be found"})
    }

    await deleteGroup.destroy(

     res.json({
        "message": "Successfully deleted"
      })
    )
})


module.exports = router;