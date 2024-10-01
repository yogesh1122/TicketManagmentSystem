import React from 'react';
import './homepage.css';
import { Link } from 'react-router-dom';
 
function Homepage() {
  return (
  <div className=''>
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">Ticket Service</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><Link to="/signuplogin">Get Support</Link></li>
        </ul>
      </nav>
          <img src={require('../../asset/images/ticket-background.jpg')} alt="Ticket Background" className="hero-image" />
          <div className="card-box-container">
              <div className="card-box">
                  <h2>Upcoming Events</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
                  <button className="btn btn-primary">Learn More</button>
              </div>
              <div className="card-box">
                  <h2>Price Drop Sale</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
                  <button className="btn btn-secondary">Shop Now</button>
              </div>
              <div className="card-box">
                  <h2>More Activity</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
                  <button className="btn btn-tertiary">Explore</button>
              </div>
          </div>  
    </div> 
    </div>
  );
}

export default Homepage;