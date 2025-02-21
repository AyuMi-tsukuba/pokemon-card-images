/**
 * Attack with a card.
 * @param {Card} attacker - The attacking card.
 * @param {Card} defender - The defending card.
 */
function attack(attacker, defender) {
  if (!attacker || !defender) {
    console.error("Invalid attacker or defender!");
    return;
  }

  // Check if the attacker has enough energy to attack
  if (
    attacker.energy >= attacker.Skill1EnergyQty &&
    (attacker.Skill1EnergyType === "AllEnergy" ||
      attacker.energyType === attacker.Skill1EnergyType)
  ) {
    const damage = attacker.Skill1DMG;
    defender.monsterHP -= damage;
    attacker.energy -= attacker.Skill1EnergyQty;

    console.log(
      `${attacker.name} attacked ${defender.name} for ${damage} damage!`
    );

    // Check if the defender is defeated
    if (defender.monsterHP <= 0) {
      defender.monsterHP = 0;
      console.log(`${defender.name} has been defeated!`);
    }
  } else {
    console.error("Not enough energy or wrong energy type to attack!");
  }
}
