import { createGroupFunc } from "../../../store/groups";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const CreateGroup = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [groupName, setGroupName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("default");
  const [privacy, setPrivacy] = useState("default");
  const [image, setImage] = useState("");
  const [validations, setValidation] = useState({});

  return (
    <>
      <h1>Become a Group Leader</h1>
      <h3>Follow steps to build your local wizarding Group</h3>
    </>
  );
};

export default CreateGroup;
