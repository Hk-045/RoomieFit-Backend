const cityScore = (myProfile, otherProfile) => {
    if (myProfile.targetCity === otherProfile.targetCity) {
        return 15;
    }

    return 0;
};

const budgetScore = (myProfile, otherProfile) => {
    const overlapStart = Math.max(
        myProfile.budgetMin,
        otherProfile.budgetMin
    );

    const overlapEnd = Math.min(
        myProfile.budgetMax,
        otherProfile.budgetMax
    );

    if (overlapEnd <= overlapStart) {
        return 0;
    }

    const overlap = overlapEnd - overlapStart;

    const combinedRange =
        Math.max(myProfile.budgetMax, otherProfile.budgetMax) -
        Math.min(myProfile.budgetMin, otherProfile.budgetMin);

    const overlapRatio = overlap / combinedRange;

    return Math.round(overlapRatio * 15);
};

const sleepScore = (myProfile, otherProfile) => {

    if (
        myProfile.sleepSchedule === "flexible" ||
        otherProfile.sleepSchedule === "flexible"
    ) {
        return 15;
    }

    if (
        myProfile.sleepSchedule === otherProfile.sleepSchedule
    ) {
        return 15;
    }

    return 5;
};

const cleanlinessScore = (myProfile, otherProfile) => {
    const difference = Math.abs(
        myProfile.cleanliness - otherProfile.cleanliness
    );

    if (difference === 0) return 15;
    if (difference === 1) return 12;
    if (difference === 2) return 9;
    if (difference === 3) return 5;

    return 0;
};

const foodScore = (myProfile, otherProfile) => {
    const a = myProfile.foodPreference;
    const b = otherProfile.foodPreference;

    if (a === "no preference" || b === "no preference") {
        return 10;
    }

    if (a === b) {
        return 10;
    }

    if (
        (a === "vegetarian" && b === "vegan") ||
        (a === "vegan" && b === "vegetarian")
    ) {
        return 8;
    }

    return 5;
};

const smokingScore = (myProfile, otherProfile) => {
    const a = myProfile.smoking;
    const b = otherProfile.smoking;

    if (a === b) return 5;

    if (
        (a === "no" && b === "occasionally") ||
        (a === "occasionally" && b === "no")
    ) {
        return 2;
    }

    if (
        (a === "occasionally" && b === "yes") ||
        (a === "yes" && b === "occasionally")
    ) {
        return 3;
    }

    return 0;
};

const drinkingScore = (myProfile, otherProfile) => {
    const a = myProfile.drinking;
    const b = otherProfile.drinking;

    if (a === b) return 5;

    if (a === "occasionally" || b === "occasionally") {
        return 3;
    }

    return 1;
};

const socializingScore = (myProfile, otherProfile) => {
    const levels = {
        rarely: 1,
        occasionally: 2,
        frequently: 3
    };

    const difference = Math.abs(
        levels[myProfile.socializing] -
        levels[otherProfile.socializing]
    );

    if (difference === 0) return 10;
    if (difference === 1) return 7;

    return 3;
};

const noiseScore = (myProfile, otherProfile) => {
    const levels = {
        quiet: 1,
        moderate: 2,
        "don't mind": 3
    };

    const difference = Math.abs(
        levels[myProfile.noiseTolerance] -
        levels[otherProfile.noiseTolerance]
    );

    if (difference === 0) return 10;
    if (difference === 1) return 7;

    return 3;
};

const calculateCompatibility = (myProfile, otherProfile) => {
    const score =
        cityScore(myProfile, otherProfile) +
        budgetScore(myProfile, otherProfile) +
        sleepScore(myProfile, otherProfile) +
        cleanlinessScore(myProfile, otherProfile) +
        foodScore(myProfile, otherProfile) +
        smokingScore(myProfile, otherProfile) +
        drinkingScore(myProfile, otherProfile) +
        socializingScore(myProfile, otherProfile) +
        noiseScore(myProfile, otherProfile);

    return score;
};

export default calculateCompatibility;