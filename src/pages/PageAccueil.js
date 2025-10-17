import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      margin: '0 auto', 
      padding: '3rem 1rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #fcdcc1ff 0%, #f5f5f5 100%)',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#333'
    }}>
      <h1 style={{ 
        color: '#FF4B00', 
        marginBottom: '2rem', 
        fontSize: '3rem', 
        fontWeight: '700',
        textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
      }}>
        Bienvenue sur la plateforme de gestion de présentations !
      </h1>
      
      <p style={{ 
        fontSize: '1.3rem', 
        color: '#444', 
        marginBottom: '3rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        Veuillez vous <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>inscrire</span> ou vous{' '}
        <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>connecter</span> pour enregistrer ou télécharger une{' '}
        <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>présentation</span>
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '400px'
      }}>
        <button
          onClick={connexion}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#FF8113',
            fontWeight: '700',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            minWidth: '150px',
            boxShadow: '0 4px 8px rgba(255, 129, 19, 0.4)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#FF5E13';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 94, 19, 0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#FF8113';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 129, 19, 0.4)';
          }}
        >
          Connexion
        </button>
        
        <button
          onClick={inscription}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#FF8113',
            fontWeight: '700',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            minWidth: '150px',
            boxShadow: '0 4px 8px rgba(255, 129, 19, 0.4)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#FF5E13';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 94, 19, 0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#FF8113';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 129, 19, 0.4)';
          }}
        >
          Inscription
        </button>
      </div>
      
      <footer style={{
        marginTop: '4rem',
        fontSize: '0.9rem',
        color: '#777'
      }}>
        &copy; 2025 Tous droits réservés.
      </footer>
    </div>
  );
};

export default PageAccueil;
