type ReviewProps = {
  capturedImage: string | null;
  onCancel: () => void;
};

export default function Review({ capturedImage, onCancel }: ReviewProps) {
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
            />
          )}

          <div className="review-form">

            <label>
              <b> Title </b>
            </label>

            <input 
              type="text"
              placeholder="Item title"
            />


            <label>
              <b> Description </b>
            </label>

            <textarea
              placeholder="Description of your item"
            />

          </div>


          <div className = "review-buttons">
            <button className = "save-button"> Save item </button>
            <button className = "cancel-button" onClick = {onCancel}> Cancel </button>

          </div>
      </div>

    </div>
  );
}