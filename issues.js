//* Completed
//? Still Pending Fix

//! PENDING FIXES

//* 1. GET /groups - Sets previewImage property to GroupImage record with preview value false.
//! added logic image.preview === true

//* 2. POST /events/{{eventId}}/images - NOT AUTHED - Add an Image to an Event - as Member & as Pending 
//* & as Stranger - Should not allow non-Members and Members with pending attendance status for an Event 
//* to add an image, currently going through.
//! Had to make better variables and add attendance model

//* 3. GET /:eventId/attendees - Not filtering Attendees via Event ID, 
//* currently returning all Attendance records. 
//! had incorrect associations in the attendance table

//* 4. DELETE /events/{{eventId}}/attendance/{{secondUserId}} - NOT AUTHED - Delete an Attendance 
//* as Member - Not being blocked and going through. Looked at the code, if the user is not the Organizer,
//?* the logged-in user will delete own attendance to specified event. Please note that the route 
//* (from API docs) specifies a target User’s attendance and not necessarily the logged-in user’s attendance to the specified event.

//* 5. DELETE /group-images/{{groupImageId}} - Getting: "message": "Forbidden"

//* 6. DELETE /event-images/{{eventImageId}} - Getting: "message": "Forbidden"

//? 7. Does not break functionality - Pagination validations - not catching negative values from query params, but would return Events with default pagination values.

//* 8. Minor - GET /groups/:groupId - make sure to return just the object instead of an array containing the object. 
//! used reduce to turn the array into an object