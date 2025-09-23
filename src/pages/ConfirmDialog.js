import React from 'react';

const ConfirmDialog = ({isOpen, title, message, onConfirm, onCancel}) =>{
    if(!isOpen) return null;

    return(
        <div className="dialog-overlay"> 
            <div className="dialog">
                <h3>{title}</h3> // Supprimé l'astérisque *
                <p>{message}</p>
                
                <div className="dialog-buttons">
                    <button onClick={onConfirm} className="btn btn-danger">
                        Confirmer
                    </button>
                    <button onClick={onCancel} className="btn btn-secondary">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
