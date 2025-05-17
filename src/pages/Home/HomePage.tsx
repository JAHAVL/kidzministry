import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiShield, FiHeart, FiMessageCircle, FiAward, FiClipboard } from 'react-icons/fi';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="quick-links">
        <h3>Quick Links</h3>
        <div className="card-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <Link to="/policies/vision" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiBookOpen style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#8a2be2' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Vision</h4>
          </Link>
          
          <Link to="/policies/team" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiUsers style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#4169e1' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Team Guidelines</h4>
          </Link>
          
          <Link to="/policies/safety" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiShield style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#db7093' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Safety Policies</h4>
          </Link>

          <Link to="/policies/behavior" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiHeart style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#8a2be2' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Behavior Guidelines</h4>
          </Link>

          <Link to="/policies/communication" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiMessageCircle style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#4169e1' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Communication</h4>
          </Link>

          <Link to="/policies/training" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiAward style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#db7093' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Training</h4>
          </Link>

          <Link to="/policies/appendix" className="card" style={{ flex: '1 1 140px', maxWidth: '180px', minWidth: '140px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem 0.75rem' }}>
            <FiClipboard style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#8a2be2' }} />
            <h4 style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>Appendix</h4>
          </Link>
        </div>
      </section>
      
      <section className="welcome-message">
        <h3>Welcome to the Team!</h3>
        <p>
          Thank you for being part of Redefine Kidz Ministry! Your dedication helps us
          fulfill our mission to see the broken redefined to the restored through Jesus Christ,
          starting with our youngest members.
        </p>
        <p>
          This app provides all the information you need to serve effectively and confidently
          in our Kidz Ministry. If you have any questions, please reach out to your team leader.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
