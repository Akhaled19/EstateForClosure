import {useState} from "react";


type ReviewProps = {
  capturedImage: string | null;
  onCancel: () => void;
};

export default function Review({ capturedImage, onCancel }: ReviewProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function saveItem() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    console.log({title, description}); // send item to database : connect to backend later
  }


  return (
    <div className="review-page">
        <div className = "review-content"> 
          <h1 className="review-title">
            Review
          </h1>

          {capturedImage && (
            <img 
              src={capturedImage}
              className="review-image"
              alt = "Captured image"
            />
          )}

          <div className="review-form">

            <label htmlFor = "title">
              <b> Title </b>
            </label>

            <input 
              id = "title"
              type="text"
              placeholder="Item title"
              value = {title}
              onChange={(e) => setTitle (e.target.value) }
            />


            <label htmlFor = "description">
              <b> Description </b>
            </label>

            <textarea
              id = "description"
              placeholder="Description of your item"
              value = {description}
              onChange = {(e) => setDescription(e.target.value) }
            />

          </div>


          <div className = "review-buttons">
            <button className = "save-button" onClick = {saveItem}> Save item </button>
            <button className = "cancel-button" onClick = {onCancel}> Cancel </button>

          </div>
      </div>

    </div>
  );
}