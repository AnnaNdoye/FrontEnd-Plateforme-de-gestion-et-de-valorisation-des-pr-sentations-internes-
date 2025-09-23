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
            const response = await departementService.getAll();
            // Mapping des données backend vers frontend
            const mappedDepartements = response.data.map(dept => ({
                id: dept.id_departement,
                nom: dept.nom_departement,
                code: dept.code,
                description: dept.description,
                nombreEmployes: dept.nombreEmployes || 0
            }));
            setDepartements(mappedDepartements);
            setError('');
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setError('Impossible de charger les départements');
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
                id: dept.id_departement,
                nom: dept.nom_departement,
                code: dept.code,
                description: dept.description,
                nombreEmployes: dept.nombreEmployes || 0
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
            await departementService.delete(departementToDelete.id);
            setSuccessMessage('Département supprimé avec succès');
            loadDepartements();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Impossible de supprimer le département');
        } finally {
            setShowDeleteDialog(false);
            setDepartementToDelete(null);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            // Mapping des données frontend vers backend
            const backendData = {
                nom_departement: formData.nom,
                code: formData.code,
                description: formData.description,
                nombreEmployes: formData.nombreEmployes
            };

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
                setError(error.response.data.message || 'Erreur lors de la sauvegarde');
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
        return <div className="loading">Chargement des départements...</div>;
    }

    return (
        <div className="departements-page">
            <header className="page-header">
                <h1>Gestion des Départements</h1>
                <button onClick={handleAddNew} className="btn btn-primary">
                    Ajouter un département
                </button>
            </header>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {showForm && (
                <div className="form-overlay">
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

                <div className="stats">
                    <p>
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