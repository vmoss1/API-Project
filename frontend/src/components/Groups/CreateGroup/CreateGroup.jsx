import {
  createGroupFunc,
  addGroupImageFunc,
  createVenueFunc,
} from "../../../store/groups";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const types = ["Select", "In person", "Online"];
  const privacies = ["Select", "Private", "Public"];

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState(types[0]);
  const [privacy, setPrivacy] = useState(privacies[0]);
  const [image, setImage] = useState("");
  const [validations, setValidations] = useState({});
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [cityVenue, setCityVenue] = useState("");
  const [stateVenue, setStateVenue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = {};
    if (!location) validate.location = "Please provide Location";
    if (!city) validate.city = "Please provide city";
    if (!state) validate.state = "Please provide state";
    if (!name) validate.name = "Please provide a name";
    if (!image) validate.image = "Please provide an image URL";
    if (about.length < 50)
      validate.about = "Please write at least 50 characters";
    if (type == "Select") validate.type = "Please ensure selection is provided";
    if (privacy == "Select")
      validate.privacy = "Please ensure selection is provided";
    if (!address) validate.address = "Please provide an address";
    if (!cityVenue) validate.cityVenue = "Please provide a city for your Venue";
    if (!stateVenue)
      validate.stateVenue = "Please provide a state for your Venue";

    const [city, state] = location.split(", ").map((item) => item.trim());

    if (Object.values(validate).length) {
      setValidations(validate);
    } else {
      const newGroup = {
        name,
        about,
        type,
        private: privacy,
        city,
        state: state,
      };

      const newImage = {
        url: image,
        preview: true,
      };

      const newVenue = {
        address,
        city: cityVenue,
        state: stateVenue,
        lat: parseInt(80),
        lng: parseInt(120),
      };

      const awaitNewGroup = await dispatch(createGroupFunc(newGroup));

      if (awaitNewGroup.validations) {
        setValidations(awaitNewGroup.validate);
      } else {
        await dispatch(addGroupImageFunc(awaitNewGroup.id, newImage));
        await dispatch(createVenueFunc(awaitNewGroup.id, newVenue));
        navigate(`/groups/${awaitNewGroup.id}`);
      }
    }
  };

  return (
    <div className="formPage">
      <form onSubmit={handleSubmit}>
        <h3 id="groupLeader">Become a Group Leader</h3>
        <h2 id="followSteps">
          Follow steps to build your local wizarding Group
        </h2>
        <div id="locationBox">
          <h2>Set Location</h2>
          <p className="group_Form">
            TheWand groups meet locally, in person and online. We will connect
            you with Wizards/Witches in your area, and more can join you online.
          </p>
          <div id="cityStateContainer">
            <label htmlFor="location">
              <input
                type="text"
                name="location"
                id="city"
                placeholder="City, STATE"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <div>
              {"city" in validations && (
                <p className="validations">{validations.city}</p>
              )}
            </div>
            <div>
              {"state" in validations && (
                <p className="validations">{validations.state}</p>
              )}
            </div>
          </div>
        </div>

        <div id="groupNameBox">
          <h2>What will your group name be</h2>
          <p className="group_Form">
            Choose a name that will give people a clear idea of what the group
            is about. You can edit this later if you change your mind.
          </p>
          <div id="groupNameContainer">
            <label htmlFor="name">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="What is the name of your group?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div>
              {"name" in validations && (
                <p className="validations">{validations.name}</p>
              )}
            </div>
          </div>
        </div>
        <div id="aboutBox">
          <h2>Now describe what your group will be about</h2>
          <p className="group_Form">
            People will see this when we promote your group, but you will be
            able to add to it later, too.
          </p>
          <ul>
            <li>1. What is the purpose of the group?</li>
            <li>2. Who should join?</li>
            <li>3. What will you do at the events?</li>
          </ul>
          <textarea
            name="About"
            id="about"
            cols="50"
            rows="10"
            placeholder="Please write at least 50 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          <div>
            {"about" in validations && (
              <p className="validations">{validations.about}</p>
            )}
          </div>
        </div>
        <div>
          <h2>Final Steps...</h2>
          <p className="group_Form">Is this an in person or online group?</p>
          <label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <div>
            {"type" in validations && (
              <p className="validations">{validations.type}</p>
            )}
          </div>
          <p className="group_Form">Is this group private or public?</p>
          <label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value={privacies}>Select</option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </label>
          <div>
            {"privacy" in validations && (
              <p className="validations">{validations.privacy}</p>
            )}
          </div>
        </div>
        <div id="finalStepsBox">
          <p className="group_Form">
            Please add an image url for your group below:
          </p>
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
              <p className="validations">{validations.image}</p>
            )}
          </div>
        </div>
        <div id="createVenueContainer">
          <h2>Create a Venue for your Group Events</h2>
          <p className="group_Form">What is the Street Address?</p>
          <label htmlFor="address">
            <input
              type="text"
              name="address"
              id="address"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <div>
            {"address" in validations && (
              <p className="validations">{validations.address}</p>
            )}
          </div>
          <p className="group_Form">What City will this be located in?</p>
          <label htmlFor="cityVenue">
            <input
              type="text"
              name="cityVenue"
              id="cityVenue"
              placeholder="City"
              value={cityVenue}
              onChange={(e) => setCityVenue(e.target.value)}
            />
          </label>
          <div>
            {"cityVenue" in validations && (
              <p className="validations">{validations.cityVenue}</p>
            )}
          </div>
          <p className="group_Form">
            What is the State or Country this will be held?
          </p>
          <label htmlFor="stateVenue">
            <input
              type="text"
              id="stateVenue"
              placeholder="State"
              value={stateVenue}
              onChange={(e) => setStateVenue(e.target.value)}
            />
          </label>
          <div>
            {"stateVenue" in validations && (
              <p className="validations">{validations.stateVenue}</p>
            )}
          </div>
          <div>
            <button id="createGroupButton" type="submit">
              Create Group
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
