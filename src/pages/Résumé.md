Résumé connaissance react

un hook est une fonction qui permet d'accrocher des fonctionnalités react dans  une composante
useState, useEffect,useContet,useRef

1-DepartementsPage
import React, { useState, useEffect } from 'react';
importe la librairie react ainsi que les hooks(usestate: pour gérer l'état et useeffect pour l'effet de bord)


--const [departements, setDepartements] = useState([]);
departements est une variable d'états et setdepartements permet de mettre à jour cette variable

--const: mot clé react pour déclarer une constante, on peut modifier l'objet pointé

--useState(): sert à gérer un état local dans un composant.
useState([]): pour stocker une liste au départ qui est vide
useState(''): pour stocker une chaine de caractères vide au départ utiliser pour les input, les formulaire ou recherche
useState(true ou false): c'est un booléen, utiliser pour stocker un état oui/non, ouvert/fermé
useState(null): indéfini pour le moment, dans l'attente d'une donnée pour effectuer l'action


--const DepartementsPage = () => 
DepartementsPage: est le nom de la composante react du même nom que le fichier
 () =>: fonction fléchée
DepartementsPage est une constante qui contient une fonction fléchée
on peut aussi utiliser la balise DepartementsPage


--useEffect: charger des effets de bord, éxécute du code en réaction à un événement dans le cycle de la composante react
useEffect(() => {
        loadDepartements();
    }, []);

    // Filtrer les départements quand le terme de recherche change
    useEffect(() => {
        filterDepartements();
    }, [searchTerm, departements]);
loadDepartements() est appelé une seule fois au montage du composant (quand il apparaît) parce que le tableau de dépendances [] est vide → ça veut dire : « exécute cet effet une seule fois ».

filterDepartements() est exécuté à chaque fois que searchTerm ou departements change.
[searchTerm, departements] = c'est le tableau de dépendances.


--mot clé async est un mot clé qui retourne une promesse
await : attend la résolution d'une Promise avant de continuer l'exécution

