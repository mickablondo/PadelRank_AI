// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "./IPadelRank.sol";

// @title PadelRank
// @notice Implementation contract for managing player rankings in the PadelRank system.
// @author MiKa Blondo
contract PadelRank is IPadelRank {
    
    /// @dev Liste des joueurs, indexée par leur numéro de licence pour un accès rapide
    mapping(string => Player) private players;

    /// @dev Liste des joueurs existants pour vérifier l'existence d'un joueur avant de l'ajouter ou de le mettre à jour
    mapping(string => bool) private playerExists;

    /// @dev stockage des licences des 10 meilleurs joueurs pour un accès rapide
    string[10] private top10Licences;
    uint256 private top10Count;

    /// @inheritdoc IPadelRank
    function addPlayer(string calldata licenceNumber, string calldata name) external override {
        require(bytes(licenceNumber).length > 0, "Licence number cannot be empty");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!playerExists[licenceNumber], "Player already exists");

        Player memory newPlayer = Player(licenceNumber, name, 0);
        players[licenceNumber] = newPlayer;
        playerExists[licenceNumber] = true;
    }

    /// @inheritdoc IPadelRank
    function updatePlayerRanking(string calldata licenceNumber, uint64 newPoints) external override {
        require(playerExists[licenceNumber], "Player does not exist");
        
        Player storage player = players[licenceNumber];
        unchecked {
            player.rankingPoints += newPoints;
        }

        // Mise à jour du top 10
        _updateTop10(licenceNumber);
    }

    /// @inheritdoc IPadelRank
    function getPlayer(string calldata licenceNumber) external view override returns (Player memory) {
        require(playerExists[licenceNumber], "Player does not exist");
        return players[licenceNumber];
    }

    /// @inheritdoc IPadelRank
    function getTenBestPlayers() external view returns (Player[] memory) {
        Player[] memory topPlayers = new Player[](top10Count);
        
        for (uint256 i = 0; i < top10Count; i++) {
            topPlayers[i] = players[top10Licences[i]];
        }
        
        return topPlayers;
    }

    /**
     * Méthodes PRIVEES
     */

    /// @dev Méthode privée pour mettre à jour la liste des 10 meilleurs joueurs
    /// @param licenceNumber Le numéro de licence du joueur à mettre à jour.
    function _updateTop10(string memory licenceNumber) private {
        uint64 playerPoints = players[licenceNumber].rankingPoints;
        
        // Vérifier si le joueur est déjà dans le top 10
        int256 currentPosition = -1;
        for (uint256 i = 0; i < top10Count; i++) {
            if (keccak256(bytes(top10Licences[i])) == keccak256(bytes(licenceNumber))) {
                currentPosition = int256(i);
                break;
            }
        }
        
        // Si pas déjà dans le top 10 et le top 10 est plein
        if (currentPosition == -1 && top10Count == 10) {
            // Vérifier si ses points sont suffisants pour entrer
            if (playerPoints <= players[top10Licences[9]].rankingPoints) {
                return; // Pas assez de points
            }
            // Remplacer le dernier
            currentPosition = 9;
            top10Licences[9] = licenceNumber;
        }
        // Si pas dans le top 10 et il y a de la place
        else if (currentPosition == -1) {
            currentPosition = int256(top10Count);
            top10Licences[top10Count] = licenceNumber;
            top10Count++;
        }
        
        // Remonter le joueur à sa position correcte
        // utilisation d'un tri à insertion pour maintenir l'ordre du top 10
        // avec swap des licences dans le tableau top10Licences dès qu'on trouve un joueur mieux classé avec moins de points
        uint256 pos = uint256(currentPosition);
        while (pos > 0 && playerPoints > players[top10Licences[pos - 1]].rankingPoints) {
            string memory temp = top10Licences[pos];
            top10Licences[pos] = top10Licences[pos - 1];
            top10Licences[pos - 1] = temp;
            pos--;
        }
    }
}