import { Spinner } from "react-bootstrap";
import "./ImgPlaceholder.css";

interface ImgPlaceholderProps {
  src?: string;
  alt?: string;
}

const ImgPlaceholder: React.FC<ImgPlaceholderProps> = (props) => {
  return (
    <div className="image-container">
      {props.src && <img srcSet={props.src} alt={props.alt} />}
      {!props.src && (
        <>
          <div className="pattern">
            <div className="pattern-overlay"></div>
            <div className="image-spinner">
              <Spinner animation="border" variant="secondary" />
            </div>
          </div>
          {/* <div className="spinner-container">
            sdsd<div className="spinner"></div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default ImgPlaceholder;
