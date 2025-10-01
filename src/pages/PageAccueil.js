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
      padding: '2rem 1rem',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#FF8113', marginBottom: '2rem' }}>
        Page d'Accueil
      </h1>
      
      <div style={{ margin: '2rem 0' }}>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '3rem' }}>
          Veuillez vous <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>inscrire</span> ou vous{' '}
          <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>connecter </span>  
          pour enregistrer ou télécharger une{' '}
          <span style={{ color: '#FF5E13', fontWeight: 'bold' }}>présentation</span>
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={connexion}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#FF8113',
              fontweight: 'bold',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            Connexion
          </button>
          
          <button
            onClick={inscription}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#FF8113',
              fontweight: 'bold',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            Inscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageAccueil;
