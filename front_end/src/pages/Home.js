import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Import custom CSS for styling
import { Link } from "react-router-dom";
// import "./Maps.css"; // Import the CSS file
const Home = () => {
  // Function to handle download
  const handleDownload = () => {
    window.location.href =
      "https://valorant.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.live.ap.exe";
  };

  return (
    <div className="container-fluid p-0">
      {/* Hero Section with Video Background */}
      <section className="hero-section position-relative" style={{ minHeight:"500px",maxHeight: "700px", marginBottom: "0" }}>
        <video autoPlay loop muted playsInline className="hero-video">
          <source
            src="https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/409ab2fc369ba5e1fe50bac10c6676d7d1365a9f.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-content text-center">
          <h1 className="display-3 text-white">Welcome to Valorant</h1>
          <p className="lead text-light">Experience the ultimate 5v5 tactical shooter!</p>
          <button className="btn btn-danger btn-lg" onClick={handleDownload}>
            Play Now
          </button>
        </div>
      </section>


      {/* WE ARE VALORANT Section */}
      <section
        data-testid="MediaPromoBlade"
        id="section-home-we-are-valorant"
        className="media-promo-blade text-center p-4"
        style={{
          // background: `url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/c8157d71a4776dd821d05ed6b82d5d875ca03386-5120x1644.png') center/cover no-repeat`,
          // color: "white",
          minHeight: "600px",
          padding: "100px 20px",
          marginBottom: "0",
        }}
      >
        <div className="container">
          <h2 className="title">WE ARE VALORANT</h2>
          <h3 className="subtitle">DEFY THE LIMITS</h3>
          <p className="description">
            Blend your style and experience on a global, competitive stage. You
            have 13 rounds to attack and defend your side using sharp gunplay
            and tactical abilities.
          </p>

          {/* Video Section */}
          <div className="mt-4">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="featured-video"
              style={{
                width: "80%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              }}
            >
              <source
                src="https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/f6ccf20dfe3f6a24ea9216bb8afaaa66740c715d.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </section>

       {/* YOUR AGENTS Section */}
       <section
        data-testid="MediaPromoBlade"
        id="section-home-we-your-agents"
        className="media-promo-blade text-center p-4"
        style={{
          // background: `url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/b9f3efa9355803cc44e4c59d3f4437cab192bec3-5120x1616.png') center/cover no-repeat`,
          // color: "white",
          minHeight: "600px",
          padding: "100px 20px",
          marginBottom: "0",
        }}
      >
        <div className="container">
          <h2 className="title">YOUR AGENTS</h2>
          <h3 className="subtitle">CREATIVITY IS YOUR GREATEST WEAPON.</h3>
          <p className="description">
            More than guns and bullets, you'll choose an Agent armed with adaptive, swift, and lethal abilities
            that create opportunities to let your gunplay shine. No two Agents play alike, just as no two
            highlight reels will look the same.
          </p>

          {/* Agents Image */}
          <div className="mt-4">
            <img
              src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/1d62a3751be9d7abfce84da8ca89be7d79f07fed-1232x1232.png"
              alt="Valorant Agents"
              style={{
                width: "50%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* View All Agents Button (Updated with React Router) */}
          <Link to="/agents" className="btn btn-primary btn-lg mt-3">
            VIEW ALL AGENTS
          </Link>
        </div>
      </section>
      <section
        data-testid="MediaPromoBlade"
        id="section-home-maps"
        className="media-promo-blade text-center p-4"
        style={{
          // background: `url('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/3828b05489971b4715f673bc0e2db81f6c7afac7-5120x1616.png') center/cover no-repeat`,
          // color: "white",
          minHeight: "600px",
          padding: "100px 20px",
          marginBottom: "0",
        }}
      >
        <div className="container">
          <h2 className="title">YOUR MAPS</h2>
          <h3 className="subtitle">FIGHT AROUND THE WORLD</h3>
          <p className="description">
            Each map is a playground to showcase your creative thinking.
            Purpose-built for team strategies, spectacular plays, and clutch
            moments. Make the play others will imitate for years to come.
          </p>

          {/* Maps Image */}
          <div className="mt-4">
            <img
              src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/65c45804e00ee97977b6eef06da370543968d161-1232x1232.png"
              alt="Valorant Maps"
              style={{
                width: "50%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* View All Maps Button */}
          <Link to="/Maps" className="btn btn-primary btn-lg mt-3">
          VIEW ALL MAPS
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
