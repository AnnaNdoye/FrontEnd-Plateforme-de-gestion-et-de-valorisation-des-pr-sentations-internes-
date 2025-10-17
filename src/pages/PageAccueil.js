import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../images/image1.png';
import image2 from '../images/image2.png';
import image3 from '../images/image3.jpeg';
import logo from '../images/logo.jpeg';

const PageAccueil = () => {
  const navigate = useNavigate();

  console.log("PageAccueil component is rendering");
  
  useEffect(() => {
    console.log("Accès réussie à PageAccueil");
  }, []);

  const connexion = () => {
    console.log("Navigation vers /connexion");
    navigate("/connexion");
  };

  const inscription = () => {
    console.log("Navigation vers /inscription");
    navigate("/inscription");
  };

  return (
    <div style={{
      margin: '0',
      padding: '0',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      color: '#333'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '100'
      }}>
        <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto' }} />
        <nav>
          <button
            onClick={connexion}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#FF8C42'}
            onMouseLeave={e => e.currentTarget.style.color = '#007bff'}
          >
            Connexion
          </button>
          <button
            onClick={inscription}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0056b3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FF8C42'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Inscription
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{
          color: '#FF8C42',
          marginBottom: '2rem',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
          lineHeight: '1.2'
        }}>
          Bienvenue sur la plateforme de gestion de présentations !
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          color: '#424242',
          marginBottom: '3rem',
          maxWidth: '700px',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          Découvrez une nouvelle façon de gérer et partager vos présentations. Inscrivez-vous ou connectez-vous pour commencer votre expérience.
        </p>

        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <button
            onClick={connexion}
            style={{
              padding: '1rem 2.5rem',
              backgroundColor: '#FF8C42',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '160px',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1976d2';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#FF8C42';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Se connecter
          </button>

          <button
            onClick={inscription}
            style={{
              padding: '1rem 2.5rem',
              backgroundColor: 'transparent',
              color: '#FF8C42',
              border: '2px solid #FF8C42',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '160px',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#FF8C42';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FF8C42';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            S'inscrire
          </button>
        </div>
      </section>

      {/* Images Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#ffffff'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#FF8C42',
          marginBottom: '3rem',
          fontSize: '2.5rem',
          fontWeight: '600'
        }}>
          Découvrez nos fonctionnalités
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          >
            <img src={image1} alt="Feature 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#FF8C42', marginBottom: '1rem', fontSize: '1.5rem' }}>Gestion Intuitive</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Interface simple et efficace pour gérer vos présentations en toute facilité.</p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          >
            <img src={image2} alt="Feature 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#FF8C42', marginBottom: '1rem', fontSize: '1.5rem' }}>Collaboration</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Partagez vos connaissances avec vos collègues.</p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          >
            <img src={image3} alt="Feature 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#FF8C42', marginBottom: '1rem', fontSize: '1.5rem' }}>Sécurité</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Vos données sont sécurisées avec les dernières technologies de protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FF8C42',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p style={{ margin: '0', fontSize: '1rem' }}>
          &copy; 2025 Plateforme de Gestion de Présentations. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default PageAccueil;
