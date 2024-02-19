import { createGroupFunc } from "../../../store/groups";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const CreateGroup = () => {
  const types = ["InPerson", "Online"];
  const privacies = ["Private", "Public"];
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [groupName, setGroupName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("Select");
  const [privacy, setPrivacy] = useState("Select");
  const [image, setImage] = useState("");
  const [validations, setValidation] = useState({});

  return (
    <div>
      <h1>Become a Group Leader</h1>
      <h3>Follow steps to build your local wizarding Group</h3>
      <div>
        <h2>Set Location</h2>
        <p>
          TheWand groups meet locally, in person and online. We will connect you
          with Wizards/Witches in your area, and more can join you online.
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
        <label htmlFor="state">
          <input
            type="text"
            id="state"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
      </div>
      <div>
        <h2>What will your group;s name be</h2>
        <p>
          Choose a name that will give people a clear idea of what the group is
          about. You can edit this later if you change your mind.
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
      </div>
      <div>
        <h2>Now describe what your group will be about</h2>
        <p>
          People will see this when we promote your group, but you will be able
          to add to it later, too.
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
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            {privacies.map((privacy) => (
              <option key={privacy}>{privacy}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default CreateGroup;
