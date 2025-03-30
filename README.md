# React-todolist-app

# Application de Gestion des Tâches

Ce projet est une application de gestion de tâches développée avec **React Native** dans le cadre d'un projet académique. Elle permet aux utilisateurs de créer, modifier, supprimer et suivre leurs tâches quotidiennes de manière efficace.

---

## Fonctionnalités

- **Création, modification et suppression** de tâches.  
- Possibilité de **marquer les tâches comme terminées** ou non terminées.  
- **Barre de progression** pour visualiser le pourcentage des tâches réalisées.  
- **Interface utilisateur** agréable et intuitive.  
- **Intégration d’une API GraphQL** pour la récupération et la mise à jour des données.  
- **Base de données MongoDB** pour la persistance et le stockage des tâches.  

---

## API Utilisée

- L’application utilise l’**API GraphQL** fournie par l’établissement universitaire.
- Pour pouvoir utiliser cette application en dehors du domaine universitaire, il faut modifier le fichier `API/apiUrl`.
- L’API doit assurer les fonctionnalités suivantes :
  1. **Authentification et création d’utilisateurs**.
  2. **Récupération des TodoListes et des TodoItems**.
  3. **Gestion de la création et de la modification** des entrées côté base de données **MongoDB** et éventuellement **Neo4j**.

Pour modifier l’URL de l’API, mettez à jour le fichier `API/apiUrl`.

---

## Prérequis

Avant de commencer, assurez-vous d’avoir les éléments suivants installés :

- **Node.js**  
- **npm** (Node Package Manager)  
- **Expo CLI**  

---

## Installation

1. **Clonez ce dépôt** sur votre machine locale :
   ```bash
   git clone https://github.com/vycash/Todo-app.git
   
2. **Accédez au répertoire du projet** :
  cd Application-Gestion-Taches

3. **Installez les dépendances** :
  npm install

4. **Lancez le projet** :
  npm run start



© 2025 - Application de Gestion des Tâches
