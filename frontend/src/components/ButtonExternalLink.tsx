import { Button } from "react-bootstrap";
import linkIcon from "../assets/link.svg";
import googleIcon from "../assets/google.svg";

interface ButtonExternalLinkProps {
  href: string;
  type: "website" | "google";
}

const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";

const ButtonExternalLink: React.FC<ButtonExternalLinkProps> = (props) => (
  <Button
    className="list-item-button"
    variant="outline-secondary"
    href={props.type === "google" ? GOOGLE_SEARCH_URL + props.href : props.href}
    target="_new"
  >
    <img
      className="list-item-button_icon"
      srcSet={props.type === "website" ? linkIcon : googleIcon}
    />
    <span className="list-item-button_text">
      {props.type === "website" ? "Website" : "Search"}
    </span>
  </Button>
);

export default ButtonExternalLink;
