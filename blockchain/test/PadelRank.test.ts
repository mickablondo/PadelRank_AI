import { describe, it, beforeEach } from "node:test";
import { expect } from "chai";
import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox-viem";

describe("PadelRank", function () {
  let padelRank: any;
  let publicClient: any;
  let walletClient: any;

  beforeEach(async function () {
    // Obtenir les clients viem
    publicClient = await (hre as any).viem.getPublicClient();
    [walletClient] = await (hre as any).viem.getWalletClients();

    // Lire l'artifact du contrat
    const artifact = await hre.artifacts.readArtifact("PadelRank");

    // Déployer le contrat
    const hash = await walletClient.deployContract({
      abi: artifact.abi,
      bytecode: artifact.bytecode as `0x${string}`,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const contractAddress = receipt.contractAddress!;

    // Créer un wrapper pour simplifier les appels
    padelRank = {
      read: {
        getPlayer: async (args: [string]) =>
          publicClient.readContract({
            address: contractAddress,
            abi: artifact.abi,
            functionName: "getPlayer",
            args,
          }),
        getTenBestPlayers: async () =>
          publicClient.readContract({
            address: contractAddress,
            abi: artifact.abi,
            functionName: "getTenBestPlayers",
          }),
      },
      write: {
        addPlayer: async (args: [string, string]) => {
          const hash = await walletClient.writeContract({
            address: contractAddress,
            abi: artifact.abi,
            functionName: "addPlayer",
            args,
          });
          await publicClient.waitForTransactionReceipt({ hash });
        },
        updatePlayerRanking: async (args: [string, bigint]) => {
          const hash = await walletClient.writeContract({
            address: contractAddress,
            abi: artifact.abi,
            functionName: "updatePlayerRanking",
            args,
          });
          await publicClient.waitForTransactionReceipt({ hash });
        },
      },
    };
  });

  describe("addPlayer", function () {
    it("Devrait ajouter un nouveau joueur avec succès", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      expect(player[0]).to.equal("LIC001"); // licenceNumber
      expect(player[1]).to.equal("Alice"); // name
      expect(player[2]).to.equal(0n); // rankingPoints
    });

    it("Devrait échouer si le numéro de licence est vide", async function () {
      try {
        await padelRank.write.addPlayer(["", "Alice"]);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Licence number cannot be empty");
      }
    });

    it("Devrait échouer si le nom est vide", async function () {
      try {
        await padelRank.write.addPlayer(["LIC001", ""]);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Name cannot be empty");
      }
    });

    it("Devrait échouer si le joueur existe déjà", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);

      try {
        await padelRank.write.addPlayer(["LIC001", "Bob"]);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Player already exists");
      }
    });
  });

  describe("updatePlayerRanking", function () {
    it("Devrait mettre à jour les points d'un joueur", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      expect(player[2]).to.equal(100n); // rankingPoints
    });

    it("Devrait ajouter les points de manière cumulative", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC001", 50n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      expect(player[2]).to.equal(150n);
    });

    it("Devrait échouer si le joueur n'existe pas", async function () {
      try {
        await padelRank.write.updatePlayerRanking(["LIC999", 100n]);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Player does not exist");
      }
    });
  });

  describe("getPlayer", function () {
    it("Devrait récupérer les informations d'un joueur", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 250n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      expect(player[0]).to.equal("LIC001");
      expect(player[1]).to.equal("Alice");
      expect(player[2]).to.equal(250n);
    });

    it("Devrait échouer si le joueur n'existe pas", async function () {
      try {
        await padelRank.read.getPlayer(["LIC999"]);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).to.include("Player does not exist");
      }
    });
  });

  describe("getTenBestPlayers", function () {
    it("Devrait retourner un tableau vide si aucun joueur", async function () {
      const topPlayers = await padelRank.read.getTenBestPlayers();
      expect(topPlayers.length).to.equal(0);
    });

    it("Devrait retourner tous les joueurs s'il y en a moins de 10", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 200n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 150n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();
      expect(topPlayers.length).to.equal(3);
    });

    it("Devrait retourner les joueurs triés par ordre décroissant", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 300n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 200n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();

      expect(topPlayers[0][0]).to.equal("LIC002"); // Bob (300)
      expect(topPlayers[1][0]).to.equal("LIC003"); // Charlie (200)
      expect(topPlayers[2][0]).to.equal("LIC001"); // Alice (100)
    });

    it("Devrait maintenir seulement 10 joueurs dans le top", async function () {
      // Ajouter 15 joueurs
      for (let i = 1; i <= 15; i++) {
        const licence = `LIC${i.toString().padStart(3, "0")}`;
        await padelRank.write.addPlayer([licence, `Player${i}`]);
        await padelRank.write.updatePlayerRanking([licence, BigInt(i * 10)]);
      }

      const topPlayers = await padelRank.read.getTenBestPlayers();
      expect(topPlayers.length).to.equal(10);

      // Vérifier que ce sont bien les 10 meilleurs (points de 150 à 60)
      expect(topPlayers[0][2]).to.equal(150n); // Player15
      expect(topPlayers[9][2]).to.equal(60n); // Player6
    });

    it("Devrait mettre à jour le top 10 quand un joueur améliore son score", async function () {
      // Créer 11 joueurs
      for (let i = 1; i <= 11; i++) {
        const licence = `LIC${i.toString().padStart(3, "0")}`;
        await padelRank.write.addPlayer([licence, `Player${i}`]);
        await padelRank.write.updatePlayerRanking([licence, BigInt(i * 10)]);
      }

      // Player1 (10 points) n'est pas dans le top 10
      let topPlayers = await padelRank.read.getTenBestPlayers();
      const licencesInTop = topPlayers.map((p: any) => p[0]);
      expect(licencesInTop).to.not.include("LIC001");

      // Player1 gagne 200 points (total: 210)
      await padelRank.write.updatePlayerRanking(["LIC001", 200n]);

      // Player1 devrait maintenant être dans le top 10
      topPlayers = await padelRank.read.getTenBestPlayers();
      expect(topPlayers[0][0]).to.equal("LIC001"); // Premier avec 210 points
      expect(topPlayers.length).to.equal(10);
    });

    it("Devrait gérer correctement les égalités de points", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 100n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();
      expect(topPlayers.length).to.equal(3);
      expect(topPlayers[0][2]).to.equal(100n);
      expect(topPlayers[1][2]).to.equal(100n);
      expect(topPlayers[2][2]).to.equal(100n);
    });

    it("Devrait maintenir l'ordre après plusieurs mises à jour", async function () {
      // Créer 5 joueurs
      for (let i = 1; i <= 5; i++) {
        const licence = `LIC${i.toString().padStart(3, "0")}`;
        await padelRank.write.addPlayer([licence, `Player${i}`]);
        await padelRank.write.updatePlayerRanking([licence, BigInt(i * 100)]);
      }

      // Player1 (100) gagne 350 points → 450 (devrait être 2ème)
      await padelRank.write.updatePlayerRanking(["LIC001", 350n]);

      // Player3 (300) gagne 250 points → 550 (devrait être 1er)
      await padelRank.write.updatePlayerRanking(["LIC003", 250n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();

      expect(topPlayers[0][0]).to.equal("LIC003"); // 550 points
      expect(topPlayers[1][0]).to.equal("LIC005"); // 500 points
      expect(topPlayers[2][0]).to.equal("LIC001"); // 450 points
      expect(topPlayers[3][0]).to.equal("LIC004"); // 400 points
      expect(topPlayers[4][0]).to.equal("LIC002"); // 200 points
    });
  });

  describe("Scénarios complexes", function () {
    it("Devrait gérer un flux complet de joueurs", async function () {
      // Ajouter 20 joueurs
      for (let i = 1; i <= 20; i++) {
        const licence = `LIC${i.toString().padStart(3, "0")}`;
        await padelRank.write.addPlayer([licence, `Player${i}`]);
      }

      // Donner des points aléatoires
      const points = [
        500n,
        450n,
        400n,
        350n,
        300n,
        250n,
        200n,
        150n,
        100n,
        50n,
        480n,
        470n,
        460n,
        430n,
        420n,
        380n,
        370n,
        320n,
        280n,
        180n,
      ];

      for (let i = 0; i < 20; i++) {
        const licence = `LIC${(i + 1).toString().padStart(3, "0")}`;
        await padelRank.write.updatePlayerRanking([licence, points[i]]);
      }

      const topPlayers = await padelRank.read.getTenBestPlayers();

      // Vérifier qu'on a bien 10 joueurs
      expect(topPlayers.length).to.equal(10);

      // Vérifier que les points sont en ordre décroissant
      for (let i = 0; i < topPlayers.length - 1; i++) {
        expect(topPlayers[i][2]).to.be.at.least(topPlayers[i + 1][2]);
      }

      // Le meilleur devrait avoir 500 points
      expect(topPlayers[0][2]).to.equal(500n);
    });
  });
});
