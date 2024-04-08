import { FaGithub } from "react-icons/fa";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div id="footer">
      <p id="about-me">Find Me</p>
      <Link id="github-link" to="https://github.com/vmoss1">
        <FaGithub /> vmoss1
      </Link>
    </div>
  );
}
