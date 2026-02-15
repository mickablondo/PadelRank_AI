// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

/// @title IPadelRank
/// @notice Interface for the PadelRank contract, which manages player rankings.
/// @author MiKa Blondo
interface IPadelRank {

    /// @dev Struct representing a player in the PadelRank system.
    struct Player {
        string licenceNumber;
        string name;
        uint64 rankingPoints;
    }

    /// @notice Adds a new player to the PadelRank system.
    /// @param licenceNumber The unique licence number of the player.
    /// @param name The name of the player.
    function addPlayer(string calldata licenceNumber, string calldata name) external;

    /// @notice Updates the ranking points of an existing player in the PadelRank system.
    /// @param licenceNumber The unique licence number of the player.
    /// @param newPoints The new points to be assigned to the player.
    function updatePlayerRanking(string calldata licenceNumber, uint64 newPoints) external;

    /// @notice Retrieves the details of a player based on their licence number.
    /// @param licenceNumber The unique licence number of the player.
    /// @return A Player struct containing the player's details, including licence number, name, and ranking points.
    function getPlayer(string calldata licenceNumber) external view returns (Player memory);

    /// @notice Retrieves the top ten players in the PadelRank system based on their ranking points.
    /// @return An array of Player structs representing the top ten players, sorted by ranking points in descending order.
    function getTenBestPlayers() external view returns (Player[] memory);
}