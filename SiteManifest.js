export const SiteManifest = {
  visuals: {
    bloomIntensity: 1.5,
    blurRadius: "8px",
    fontFamily: '"Press Start 2P", system-ui, sans-serif',
    colors: {
      enemyRed: "#FF3131",
      allyBlue: "#FFFFFF",
      currencyYellow: "#FF3131", // Changing bits to red
      background: "#000000",     // Darker black background
      text: "#FFFFFF",           // Brighter white for outlines and text
    }
  },
  balance: {
    startingBits: 50,
    bitDropRate: [3, 5], // min, max
    upgradeCosts: {
      pulse: [20, 50, 100],
      nova: [40, 80, 150],
      tesla: [50, 100, 200]
    },
    enemyHP: {
      scout: 10,
      grunt: 30,
      tank: 100
    },
    tokenCosts: {
      scout: 1,
      grunt: 3,
      tank: 10
    },
    spawnBaseDelay: 3000,
    maxDifficultyScalar: 10
  },
  ui: {
    springConfig: {
      stiffness: 300,
      damping: 15
    }
  }
};
