import { createEventFunc, addEventImageFunc } from "../../../store/events";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateEvent.css";

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const types = ["Select", "In person", "Online"];
  const { groupName, groupId } = location.state;
  const capacity = 1;

  const [name, setName] = useState("");
  const [type, setType] = useState(types[0]);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [validations, setValidations] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = {};

    if (!name) validate.name = "Please provide a name";
    if (!startDate) validate.startDate = "Please provide a start date";
    if (!endDate) validate.endDate = "Please provide an end date";
    if (!image) validate.image = "Please provide an image URL";
    if (!price) validate.price = "Please provide price";
    if (description.length < 30)
      validate.description = "Please write at least 30 characters";
    if (type == "Select") validate.type = "Please ensure selection is provided";

    if (Object.values(validate).length) {
      setValidations(validate);
    } else {
      const newEvent = {
        name,
        type,
        price: parseInt(price),
        startDate,
        endDate,
        description,
        capacity: parseInt(capacity),
      };

      //   console.log("NEWEVENT", newEvent);

      const newImage = {
        url: image,
        preview: true,
      };

      const awaitNewEvent = await dispatch(createEventFunc(groupId, newEvent));

      await dispatch(addEventImageFunc(awaitNewEvent.id, newImage));

      navigate(`/events/${awaitNewEvent.id}`);
    }
  };

  return (
    <div className="formEventPage">
      <form onSubmit={handleSubmit}>
        <h3 id="eventLeader">Create an event for {groupName} </h3>
        <div id="nameBox">
          <h2>Name your event</h2>

          <label htmlFor="name">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div>
            {"name" in validations && (
              <p className="eventValidations">{validations.name}</p>
            )}
          </div>
        </div>
        <div>
          <div>
            <p>Is this an in person or online event?</p>
            <label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <div>
              {"type" in validations && (
                <p className="eventValidations">{validations.type}</p>
              )}
            </div>
          </div>

          <div id="eventPriceBox">
            <p>What is the price for your event?</p>
            <label htmlFor="price">
              <input
                type="number"
                name="price"
                id="price"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <div>
              {"price" in validations && (
                <p className="eventValidations">{validations.price}</p>
              )}
            </div>
          </div>

          <div>
            <label>
              Start Date of your event
              <input
                type="datetime-local"
                placeholder={startDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            {"startDate" in validations && (
              <p className="eventValidations">{validations.startDate}</p>
            )}
          </div>
        </div>

        <div id="dateBox">
          <label>
            When does it end?
            <input
              type="datetime-local"
              placeholder={endDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          {"endDate" in validations && (
            <p className="eventValidations">{validations.endDate}</p>
          )}
        </div>

        <div id="finalStepsBox">
          <p>Please add an image url for your event below:</p>
          <label htmlFor="image">
            <input
              type="text"
              name="Image"
              id="Image"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>
          <div>
            {"image" in validations && (
              <p className="eventValidations">{validations.image}</p>
            )}
          </div>
        </div>

        <div id="descriptionBox">
          <h2>Now describe your event</h2>
          <textarea
            name="description"
            id="description"
            cols="50"
            rows="10"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div>
            {"description" in validations && (
              <p className="eventValidations">{validations.description}</p>
            )}
          </div>
        </div>
        <div>
          <button onClick={handleSubmit}>Create Event</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
