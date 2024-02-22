import { updateGroupFunc } from "../../../store/groups";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./UpdateGroup.css";

const UpdateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: locationState } = useLocation(); // can access this data from the location state that was passed in
  const types = ["Select", "In person", "Online"];
  const privacies = ["Select", "Private", "Public"];
  const currentUser = useSelector((state) => state.session?.user);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState(types[0]);
  const [privacy, setPrivacy] = useState(privacies[0]);
  const [validations, setValidations] = useState({});

  useEffect(() => {
    if (!currentUser || !locationState) navigate("/");

    let {
      groupCity,
      groupState,
      groupName,
      groupAbout,
      groupType,
      groupPrivate,
    } = locationState;

    setCity(groupCity || "");
    setState(groupState || "");
    setName(groupName || "");
    setAbout(groupAbout || "");
    setType(groupType || "");
    setPrivacy(groupPrivate ? "true" : "false");
  }, [currentUser, locationState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupId = locationState.groupId; // accessing group from the locationState
    const validate = {};

    if (!city) validate.city = "Please provide city";
    if (!state) validate.state = "Please provide state";
    if (!name) validate.name = "Please provide a name";
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

      const awaitNewGroup = await dispatch(updateGroupFunc(groupId, newGroup));

      navigate(`/groups/${awaitNewGroup.id}`);
    }
  };

  return (
    <div className="formPage">
      <form onSubmit={handleSubmit}>
        <h3 id="groupLeader">Update Your Group Info</h3>
        <h2 id="followSteps">Follow steps to update any information</h2>
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
              placeholder="What is your group name?"
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
        <div>
          <button type="submit">Update Group</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateGroup;
