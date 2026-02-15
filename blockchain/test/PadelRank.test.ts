import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import hre from "hardhat";

describe("PadelRank", function () {
  let padelRank: any;
  let publicClient: any;
  let walletClient: any;

  beforeEach(async function () {
    // Obtenir les clients viem
    const { viem } = await hre.network.connect();
    publicClient = await viem.getPublicClient();
    [walletClient] = await viem.getWalletClients();

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
      assert.strictEqual(player[0], "LIC001"); // licenceNumber
      assert.strictEqual(player[1], "Alice"); // name
      assert.strictEqual(player[2], 0n); // rankingPoints
    });

    it("Devrait échouer si le numéro de licence est vide", async function () {
      await assert.rejects(
        async () => {
          await padelRank.write.addPlayer(["", "Alice"]);
        },
        (error: any) => {
          return error.message.includes("Licence number cannot be empty");
        },
      );
    });

    it("Devrait échouer si le nom est vide", async function () {
      await assert.rejects(
        async () => {
          await padelRank.write.addPlayer(["LIC001", ""]);
        },
        (error: any) => {
          return error.message.includes("Name cannot be empty");
        },
      );
    });

    it("Devrait échouer si le joueur existe déjà", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);

      await assert.rejects(
        async () => {
          await padelRank.write.addPlayer(["LIC001", "Bob"]);
        },
        (error: any) => {
          return error.message.includes("Player already exists");
        },
      );
    });
  });

  describe("updatePlayerRanking", function () {
    it("Devrait mettre à jour les points d'un joueur", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      assert.strictEqual(player[2], 100n);
    });

    it("Devrait ajouter les points de manière cumulative", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC001", 50n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      assert.strictEqual(player[2], 150n);
    });

    it("Devrait échouer si le joueur n'existe pas", async function () {
      await assert.rejects(
        async () => {
          await padelRank.write.updatePlayerRanking(["LIC999", 100n]);
        },
        (error: any) => {
          return error.message.includes("Player does not exist");
        },
      );
    });
  });

  describe("getPlayer", function () {
    it("Devrait récupérer les informations d'un joueur", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.updatePlayerRanking(["LIC001", 250n]);

      const player = await padelRank.read.getPlayer(["LIC001"]);
      assert.strictEqual(player[0], "LIC001");
      assert.strictEqual(player[1], "Alice");
      assert.strictEqual(player[2], 250n);
    });

    it("Devrait échouer si le joueur n'existe pas", async function () {
      await assert.rejects(
        async () => {
          await padelRank.read.getPlayer(["LIC999"]);
        },
        (error: any) => {
          return error.message.includes("Player does not exist");
        },
      );
    });
  });

  describe("getTenBestPlayers", function () {
    it("Devrait retourner un tableau vide si aucun joueur", async function () {
      const topPlayers = await padelRank.read.getTenBestPlayers();
      assert.strictEqual(topPlayers.length, 0);
    });

    it("Devrait retourner tous les joueurs s'il y en a moins de 10", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 200n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 150n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();
      assert.strictEqual(topPlayers.length, 3);
    });

    it("Devrait retourner les joueurs triés par ordre décroissant", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 300n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 200n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();

      assert.strictEqual(topPlayers[0][0], "LIC002"); // Bob (300)
      assert.strictEqual(topPlayers[1][0], "LIC003"); // Charlie (200)
      assert.strictEqual(topPlayers[2][0], "LIC001"); // Alice (100)
    });

    it("Devrait maintenir seulement 10 joueurs dans le top", async function () {
      // Ajouter 15 joueurs
      for (let i = 1; i <= 15; i++) {
        const licence = `LIC${i.toString().padStart(3, "0")}`;
        await padelRank.write.addPlayer([licence, `Player${i}`]);
        await padelRank.write.updatePlayerRanking([licence, BigInt(i * 10)]);
      }

      const topPlayers = await padelRank.read.getTenBestPlayers();
      assert.strictEqual(topPlayers.length, 10);

      // Vérifier que ce sont bien les 10 meilleurs (points de 150 à 60)
      assert.strictEqual(topPlayers[0][2], 150n); // Player15
      assert.strictEqual(topPlayers[9][2], 60n); // Player6
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
      assert.ok(!licencesInTop.includes("LIC001"));

      // Player1 gagne 200 points (total: 210)
      await padelRank.write.updatePlayerRanking(["LIC001", 200n]);

      // Player1 devrait maintenant être dans le top 10
      topPlayers = await padelRank.read.getTenBestPlayers();
      assert.strictEqual(topPlayers[0][0], "LIC001"); // Premier avec 210 points
      assert.strictEqual(topPlayers.length, 10);
    });

    it("Devrait gérer correctement les égalités de points", async function () {
      await padelRank.write.addPlayer(["LIC001", "Alice"]);
      await padelRank.write.addPlayer(["LIC002", "Bob"]);
      await padelRank.write.addPlayer(["LIC003", "Charlie"]);

      await padelRank.write.updatePlayerRanking(["LIC001", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC002", 100n]);
      await padelRank.write.updatePlayerRanking(["LIC003", 100n]);

      const topPlayers = await padelRank.read.getTenBestPlayers();
      assert.strictEqual(topPlayers.length, 3);
      assert.strictEqual(topPlayers[0][2], 100n);
      assert.strictEqual(topPlayers[1][2], 100n);
      assert.strictEqual(topPlayers[2][2], 100n);
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

      assert.strictEqual(topPlayers[0][0], "LIC003"); // 550 points
      assert.strictEqual(topPlayers[1][0], "LIC005"); // 500 points
      assert.strictEqual(topPlayers[2][0], "LIC001"); // 450 points
      assert.strictEqual(topPlayers[3][0], "LIC004"); // 400 points
      assert.strictEqual(topPlayers[4][0], "LIC002"); // 200 points
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
      assert.strictEqual(topPlayers.length, 10);

      // Vérifier que les points sont en ordre décroissant
      for (let i = 0; i < topPlayers.length - 1; i++) {
        assert.ok(topPlayers[i][2] >= topPlayers[i + 1][2]);
      }

      // Le meilleur devrait avoir 500 points
      assert.strictEqual(topPlayers[0][2], 500n);
    });
  });
});
