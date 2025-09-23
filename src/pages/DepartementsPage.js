import React, { useState, useEffect } from 'react';
import { departementService } from '../services/departementService';
import SearchBar from './SearchBar';
import DepartementList from './DepartementList';
import DepartementForm from './DepartementForm';
import ConfirmDialog from './ConfirmDialog';

const DepartementsPage = () => {
    const [departements, setDepartements] = useState([]);
    const [filteredDepartements, setFilteredDepartements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDepartement, setEditingDepartement] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [departementToDelete, setDepartementToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Charger les départements au démarrage
    useEffect(() => {
        loadDepartements();
    }, []);

    // Filtrer les départements quand le terme de recherche change
    useEffect(() => {
        filterDepartements();
    }, [searchTerm, departements]);

    const loadDepartements = async () => {
        try {
            setLoading(true);
            console.log('Chargement des départements...');
            
            // Test de connexion d'abord
            await departementService.test();
            console.log('Connexion API OK');
            
            const response = await departementService.getAll();
            console.log('Départements reçus:', response.data);
            
            // Mapping des données backend vers frontend
            const mappedDepartements = response.data.map(dept => ({
                id: dept.idDepartement,
                nom: dept.nomDepartement,
                code: dept.code,
                description: dept.description
            }));
            
            console.log('Départements mappés:', mappedDepartements);
            setDepartements(mappedDepartements);
            setError('');
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            if (error.code === 'ERR_NETWORK') {
                setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 8080.');
            } else if (error.response) {
                setError(`Erreur serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`);
            } else {
                setError('Impossible de charger les départements');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterDepartements = async () => {
        if (!searchTerm.trim()) {
            setFilteredDepartements(departements);
            return;
        }
        
        try {
            const response = await departementService.search(searchTerm);
            // Mapping des résultats de recherche
            const mappedResults = response.data.map(dept => ({
                id: dept.idDepartement,
                nom: dept.nomDepartement,
                code: dept.code,
                description: dept.description
            }));
            setFilteredDepartements(mappedResults);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setFilteredDepartements([]);
        }
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
    };

    const handleAddNew = () => {
        setEditingDepartement(null);
        setShowForm(true);
    };

    const handleEdit = (departement) => {
        setEditingDepartement(departement);
        setShowForm(true);
    };

    const handleDelete = (departement) => {
        setDepartementToDelete(departement);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            console.log('Suppression du département:', departementToDelete);
            await departementService.delete(departementToDelete.id);
            setSuccessMessage('Département supprimé avec succès');
            loadDepartements();
            setError('');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            if (error.response) {
                setError(`Erreur lors de la suppression: ${error.response.data?.message || 'Erreur inconnue'}`);
            } else {
                setError('Impossible de supprimer le département');
            }
        } finally {
            setShowDeleteDialog(false);
            setDepartementToDelete(null);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            console.log('Soumission du formulaire:', formData);
            
            // Mapping des données frontend vers backend
            const backendData = {
                nomDepartement: formData.nom,
                code: formData.code,
                description: formData.description
            };
            
            console.log('Données pour le backend:', backendData);

            if (editingDepartement) {
                await departementService.update(editingDepartement.id, backendData);
                setSuccessMessage('Département modifié avec succès');
            } else {
                await departementService.create(backendData);
                setSuccessMessage('Département ajouté avec succès');
            }

            setShowForm(false);
            setEditingDepartement(null);
            loadDepartements();
            setError('');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (error.response && error.response.data) {
                if (typeof error.response.data === 'string') {
                    setError(error.response.data);
                } else if (error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Erreur lors de la sauvegarde');
                }
            } else {
                setError('Impossible de sauvegarder le département');
            }
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingDepartement(null);
    };

    // Effacer les messages après quelques secondes
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (loading) {
        return (
            <div className="loading" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px' 
            }}>
                <p>Chargement des départements...</p>
            </div>
        );
    }

    return (
        <div className="departements-page">
            <header className="page-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <h1 style={{ margin: 0 }}>Gestion des Départements</h1>
                <button 
                    onClick={handleAddNew} 
                    className="btn btn-primary"
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Ajouter un département
                </button>
            </header>

            {error && (
                <div className="alert alert-error" style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success" style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #c3e6cb'
                }}>
                    {successMessage}
                </div>
            )}

            {showForm && (
                <div className="form-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <DepartementForm
                        departement={editingDepartement}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        isEditing={!!editingDepartement}
                    />
                </div>
            )}

            <div className="content">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClear={handleSearchClear}
                />

                <div className="stats" style={{ 
                    margin: '20px 0',
                    padding: '10px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>
                        {searchTerm
                            ? `${filteredDepartements.length} département(s) trouvé(s)`
                            : `${departements.length} département(s) au total`
                        }
                    </p>
                </div>

                <DepartementList
                    departements={filteredDepartements}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le département "${departementToDelete?.nom}" ?`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
};

export default DepartementsPage;