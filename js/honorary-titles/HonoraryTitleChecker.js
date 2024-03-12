
class HonoraryTitleChecker {
	constructor(completedGameStats) {
		this.completedGameStats = completedGameStats;

		this.totalGamesTally = 0;

		this.tallyTotalGames();
	}

	static logicOptions = {
		any: "ANY",
		all: "ALL"
	}

	tallyTotalGames() {
		this.totalGamesTally = 0;

		for (var i = 0; i < this.completedGameStats.length; i++) {
			if (this.completedGameStats[i].gameType !== 'Pai Sho Playground') {
				this.totalGamesTally += this.completedGameStats[i].totalGamesCompleted;
			}
		}
	}

	getTitleAchieved() {
		var highestTitleName = "None yet";

		if (this.checkTitleAchieved({
			requirements: [ { totalGames: 100 } ]
		})) {
			highestTitleName = "Nomad";
		}

		if (this.checkTitleAchieved({
			requirements: [ { totalGames: 200 } ]
		})) {
			highestTitleName = "Acolyte";
		}

		if (this.checkTitleAchieved({
			requirements: [ { totalGames: 300 } ]
		})) {
			highestTitleName = "Apprentice";
		}

		if (this.checkTitleAchieved({
			// titleLogic: HonoraryTitleChecker.logicOptions.any,	// ANY is default
			requirements: [
				{ totalGames: 500 },
				{ gamesPerType: { types: 2, games: 225 } },
				{ gamesPerType: { types: 3, games: 135 } },
				{ gamesPerType: { types: 4, games: 90 } }
			]
		})) {
			highestTitleName = "Sifu";
		}

		if (this.checkTitleAchieved({
			requirements: [
				{ totalGames: 1000 },
				{ gamesPerType: { types: 2, games: 450 } },
				{ gamesPerType: { types: 3, games: 265 } },
				{ gamesPerType: { types: 4, games: 175 } }
			]
		})) {
			highestTitleName = "Sage";
		}

		if (this.checkTitleAchieved({
			requirements: [
				{ totalGames: 1500 },
				{ gamesPerType: { types: 2, games: 675 } },
				{ gamesPerType: { types: 3, games: 400 } },
				{ gamesPerType: { types: 4, games: 265 } }
			]
		})) {
			highestTitleName = "Monk";
		}

		if (this.checkTitleAchieved({
			requirements: [
				{ totalGames: 2000 },
				{ gamesPerType: { types: 2, games: 900 } },
				{ gamesPerType: { types: 3, games: 535 } },
				{ gamesPerType: { types: 4, games: 350 } }
			]
		})) {
			highestTitleName = "Guru";
		}

		if (this.checkTitleAchieved({
			requirements: [
				{ totalGames: 3000 },
				{ gamesPerType: { types: 2, games: 1350 } },
				{ gamesPerType: { types: 3, games: 800 } },
				{ gamesPerType: { types: 4, games: 525 } }
			]
		})) {
			highestTitleName = "Enlightened";
		}

		if (this.checkTitleAchieved({
			titleLogic: HonoraryTitleChecker.logicOptions.all,
			requirements: [
				{ totalGames: 5000 },
				{ gamesPerType: { types: 4, games: 1000 } }
			]
		})) {
			highestTitleName = "Spirit Walker";
		}

		return highestTitleName;
	}

	checkTitleAchieved(titleObject) {
		var titleLogic = titleObject.titleLogic ? titleObject.titleLogic : HonoraryTitleChecker.logicOptions.any;	// "any" is default option

		var allRequirementsMet = true;	// assume true for logic checks
		var anyRequirementsMet = false;

		titleObject.requirements && titleObject.requirements.forEach(requirement => {
			if (requirement.totalGames) {
				if (this.totalGamesTally >= requirement.totalGames) {
					anyRequirementsMet = true;
				} else {
					allRequirementsMet = false;
				}
			} else if (requirement.gamesPerType) {
				var typesWithEnoughGames = 0;
				for (var i = 0; i < this.completedGameStats.length; i++) {
					if (this.completedGameStats[i].gameType !== 'Pai Sho Playground') {
						if (this.completedGameStats[i].totalGamesCompleted >= requirement.gamesPerType.games) {
							typesWithEnoughGames++;
						}
					}
				}
				if (typesWithEnoughGames >= requirement.gamesPerType.types) {
					anyRequirementsMet = true;
				} else {
					allRequirementsMet = false;
				}
			}
		});

		if (titleLogic === HonoraryTitleChecker.logicOptions.all) {
			return allRequirementsMet;
		} else {
			return anyRequirementsMet;
		}
	}
}
