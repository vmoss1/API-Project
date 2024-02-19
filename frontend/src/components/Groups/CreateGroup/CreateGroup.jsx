import { createGroupFunc, addGroupImageFunc } from "../../../store/groups";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const types = ["InPerson", "Online"];
  const privacies = ["Private", "Public"];
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [groupName, setGroupName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("Select");
  const [privacy, setPrivacy] = useState("Select");
  const [image, setImage] = useState("");
  const [validations, setValidations] = useState({});

  useEffect(() => {}, []);

  function handleSubmit(e) {
    e.preventDefault();

    const validations = {};

    if (!city) validations.city = "Please provide city";
    if (!state) validations.city = "Please provide state";
    if (!name) validations.name = "Please provide a name";
    if (!image) validations.image = "Please provide an image URL";
    if (type === "Select" || !type)
      validations.type = "Please ensure selection is provided";
    if (privacy === "Select" || !privacy)
      validations.privacy = "Please ensure selection is provided";

    if (Object.values(validations).length) {
      setValidations(validations);
    } else {
      const newGroup = {
        name,
        about,
        type,
        private: privacy,
        city,
        state: state.toUpperCase(),
      };

      const newImage = {
        url: image,
        preview: true,
      };

      const awaitNewGroup = dispatch(createGroupFunc(newGroup));

      if (awaitNewGroup.validations) {
        setValidations(awaitNewGroup.validations);
      } else {
        dispatch(addGroupImageFunc(awaitNewGroup.id, newImage));
        navigate(`/groups/${awaitNewGroup.id}`);
      }
    }
  }

  return (
    <div className="formPage">
      <form>
        <h3 id="groupLeader">Become a Group Leader</h3>
        <h2 id="followSteps">
          Follow steps to build your local wizarding Group
        </h2>
        <div id="locationBox">
          <h2>Set Location</h2>
          <p>
            TheWand groups meet locally, in person and online. We will connect
            you with Wizards/Witches in your area, and more can join you online.
          </p>
          <label htmlFor="city">
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          {"city" in validations && <p>{validations.city}</p>}

          <label htmlFor="state">
            <input
              type="text"
              id="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          {"state" in validations && <p>{validations.state}</p>}
        </div>
        <div id="groupNameBox">
          <h2>What will your group;s name be</h2>
          <p>
            Choose a name that will give people a clear idea of what the group
            is about. You can edit this later if you change your mind.
          </p>
          <label htmlFor="groupName">
            <input
              type="text"
              name="groupName"
              id="groupName"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </label>
          {"groupName" in validations && <p>{validations.groupName}</p>}
        </div>
        <div id="aboutBox">
          <h2>Now describe what your group will be about</h2>
          <p>
            People will see this when we promote your group, but you will be
            able to add to it later, too.
          </p>
          <ul>
            <li>1. What is the purpose of the group?</li>
            <li>2. Who should join?</li>
            <li>3. What will you do at the events?</li>
          </ul>
          <label htmlFor="about">
            <input
              type="text"
              name="About"
              id="About"
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </label>
        </div>
        <div>
          <h2>Final Steps...</h2>
          <p>Is this an in person or online group?</p>
          <label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <p>Is this group private or public?</p>
          <label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              {privacies.map((privacy) => (
                <option key={privacy}>{privacy}</option>
              ))}
            </select>
          </label>
        </div>
        <div id="finalStepsBox">
          <p>Please add an image url for your group below:</p>
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
        </div>
        <div>
          <button onSubmit={handleSubmit}>Create Group</button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
