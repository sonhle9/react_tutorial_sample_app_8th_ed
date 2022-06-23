import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <small>
        The <a href="https://github.com/sonhle9/react_tutorial_sample_app_8th_ed/" target="_blank" rel="noopener noreferrer">React Tutorial</a> by <a href="https://github.com/sonhle9/" target="_blank" rel="noopener noreferrer">matt</a>
      </small>
      <nav>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">News</a></li>
        </ul>
      </nav>
    </footer>
  )
}
