import { Dice } from "../db"

export const MacroRandomizer = (macro: Dice) => {
    let min = 0;
    let max = 0;

    Object.entries(macro).map(([key, value]) => {
        min += value;
        const keyAsNumber = parseInt(key.substring(1));
        const y = keyAsNumber * value
        max += y
    })
    return Math.floor(Math.random() * (max - min + 1)) + min;
}