import { useModal } from "../../context/Modal";
import "./DeleteModal.css";

function DeleteModal({ onDelete }) {
  const { closeModal } = useModal();

  return (
    <div id="deleteModalContainer">
      <p id="deleteP">Are you sure you want to delete?</p>
      <div className="buttonContainer1">
        <button
          id="yes"
          type="button"
          onClick={() => {
            onDelete();
            closeModal();
          }}
        >
          Yes!
        </button>
        <button id="no" type="button" onClick={() => closeModal()}>
          No!
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
