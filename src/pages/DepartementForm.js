import React, { useState, useEffect } from 'react';

const DepartementForm = ({ departement, onSubmit, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
    nom: '',
    code: '',
    description: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
    if (departement) {
        setFormData(departement);
    } else {
        setFormData({
        nom: '',
        code: '',
        description: ''
        });
    }
    }, [departement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
    };

    const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
        newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
        newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.code.trim()) {
        newErrors.code = 'Le code est requis';
    } else if (formData.code.length < 2) {
        newErrors.code = 'Le code doit contenir au moins 2 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit(formData);
    }
    };

    return (
    <div className="form-container">
        <h3>{isEditing ? 'Modifier le département' : 'Ajouter un département'}</h3>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="nom">Nom du département <strong style={{color: 'red'}}>*</strong></label>
            <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={errors.nom ? 'error' : ''}
            />
            {errors.nom && <span className="error-message">{errors.nom}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="code">Code du département <strong style={{color: 'red'}}>*</strong></label>
            <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={errors.code ? 'error' : ''}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
        </div>

        <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            />
        </div>

        <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
            {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
            Annuler
            </button>
        </div>
        </form>
    </div>
    );
};

export default DepartementForm;




/*
Explication détaillé du code DepartementForm.js

*/