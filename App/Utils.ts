import { Dice, DiceRolls } from "../db"

export const MacroRandomizer = (macro: Dice) => {
    let max = 0;
    let allRolls: DiceRolls = {
        D4: [],
        D6: [],
        D8: [],
        D10: [],
        D12: [],
        D20: [],
        D100: [],
    }

    Object.entries(macro).map(([key, value]) => {
        const keyAsNumber = parseInt(key.substring(1));
        for (let index = 0; index < value; index++) {
            allRolls[key as keyof DiceRolls].push((Math.floor(Math. random() * (keyAsNumber) + 1)))
        }
    })
    return allRolls
}