# PadelRank AI 🎾🤖

PadelRank AI est un projet Web3 qui explore
l’intégration du **Machine Learning** avec des **smart contracts Solidity**
pour gérer un **classement de joueurs de padel**.

L’objectif est simple :
> attribuer des points après chaque match de façon plus intelligente
qu’avec des règles fixes.

---

## 🧠 Principe général

1. Des joueurs disputent un match de padel
2. Les informations du match sont envoyées à une IA (Machine Learning)
3. L’IA calcule combien de points chaque joueur doit gagner ou perdre
4. Ces points sont appliqués **on-chain** via un smart contract Solidity
5. Le classement est basé sur le total de points accumulés

---

## 🤖 Rôle de l’IA (Machine Learning)

L’IA ne prédit pas le vainqueur.
Elle sert à **évaluer la valeur d’un match**.

Elle prend en compte par exemple :
- le niveau des joueurs
- leur classement actuel
- l’écart de score
- le type de tournoi

Elle retourne un résultat simple : un entier représentant les points du vainqueur.

Ce nombre est ensuite appliqué par le smart contract.

L’IA est volontairement **simple et explicable**
(régression, pas de deep learning).

---

## 🔗 Rôle de la blockchain (Solidity)

Le smart contract :
- stocke les joueurs et leurs points
- applique les points calculés par l’IA
- empêche toute modification ou triche a posteriori

Il **ne fait aucun calcul IA**.
Il exécute des règles strictes et vérifiables.

---

## 🖥️ Rôle du frontend

Le frontend React :
- permet de saisir les résultats des matchs
- appelle l’API IA pour calculer les points
- envoie la transaction au smart contract
- affiche le classement des joueurs

Dans ce projet, le frontend joue aussi le rôle d’**oracle**.

---

## Stack technique 

Les technologies choisies sont :  
– Solidity pour les smart contracts (avec Foundry et Hardhat) ;  
– React pour l’IHM ;  
– Python avec FastApi et scikit-learn pour le calcul des points via un modèle de machine learning.    

### 🗂️ Architecture du projet

Chaque partie a son répertoire.

```text
padelrank-ai/
│
├── contracts/
│
├── ai/
│
├── frontend/  
│
└── README.md
```

### Web3 Frontend Stack

- **Next.js** – Framework React pour le frontend et le routing  
  🔗 [nextjs.org](https://nextjs.org)

- **viem** – Librairie bas niveau pour interagir avec Ethereum  
  🔗 [viem.sh](https://viem.sh)

- **wagmi** – Hooks React pour Web3 et gestion des wallets  
  🔗 [wagmi.sh](https://wagmi.sh)

- **RainbowKit** – UI pour la connexion aux wallets  
  🔗 [rainbowkit.com](https://www.rainbowkit.com)
