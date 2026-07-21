import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <h2>VTU AI Tutor</h2>
      </div>

      <div className="menu">

        <Link to="/">Home</Link>

        <Link to="/upload">Upload</Link>

        <Link to="/chat">Chat</Link>

        <Link to="/quiz">Quiz</Link>

        <Link to="/about">About</Link>

      </div>

    </nav>
  );
}

export default Navbar;