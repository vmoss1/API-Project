import { createGroupFunc, addGroupImageFunc } from "../../../store/groups";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const types = ["Select", "In person", "Online"];
  const privacies = ["Select", "Private", "Public"];

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState(types[0]);
  const [privacy, setPrivacy] = useState(privacies[0]);
  const [image, setImage] = useState("");
  const [validations, setValidations] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = {};

    if (!city) validate.city = "Please provide city";
    if (!state) validate.state = "Please provide state";
    if (!name) validate.name = "Please provide a name";
    if (!image) validate.image = "Please provide an image URL";
    if (about.length < 30)
      validate.about = "Please write at least 30 characters";
    if (type == "Select") validate.type = "Please ensure selection is provided";
    if (privacy == "Select")
      validate.privacy = "Please ensure selection is provided";

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

      const awaitNewGroup = await dispatch(createGroupFunc(newGroup));

      await dispatch(addGroupImageFunc(awaitNewGroup.id, newImage));

      navigate(`/groups/${awaitNewGroup.id}`);
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
          <div>
            {"city" in validations && (
              <p className="validations">{validations.city}</p>
            )}
          </div>

          <label htmlFor="state">
            <input
              type="text"
              id="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          <div>
            {"state" in validations && (
              <p className="validations">{validations.state}</p>
            )}
          </div>
        </div>

        <div id="groupNameBox">
          <h2>What will your group name be</h2>
          <p>
            Choose a name that will give people a clear idea of what the group
            is about. You can edit this later if you change your mind.
          </p>
          <label htmlFor="name">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
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
          <textarea
            name="About"
            id="about"
            cols="50"
            rows="10"
            placeholder="Please write at least 30 characters"
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
          <p>Is this an in person or online group?</p>
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
          <p>Is this group private or public?</p>
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
          <div>
            {"image" in validations && (
              <p className="validations">{validations.image}</p>
            )}
          </div>
        </div>
        <div>
          <button type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
