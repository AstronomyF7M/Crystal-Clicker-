export default {
    message: "Hello from config.js!",
    weather: {
        interval: 15000, // Weather change interval (milliseconds)
        probabilities: {
            Clear: 0.5,
            Rain: 0.2,
            Snow: 0.1,
            Storm: 0.2
        },
        effects: {
            Rain: 1.5,  // 50% increase in crystal generation
            Snow: 0.5,  // 50% decrease in crystal generation
            Storm: 0.2, //90% decrease in crystal generation,
            Clear: 1
        },
        stormDuration: 5000, // Storm duration in milliseconds
        stormRecoveryMultiplier: 3, //Boost after storm
        weatherControlCost: 20000 //Crystals
    }
};
