module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // You can specify targets here if needed, otherwise preset-env uses defaults
                // For EdgeWorkers, targeting node might be appropriate:
                targets: {
                    node: 'current' // Or a specific Node version supported by EdgeWorkers
                }
                // If you used "defaults" before, you might not need specific targets
                // targets: "defaults" // This is also valid if that's what you intended
            }
        ]
    ]
};