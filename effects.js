/**
 * Apply the effect of a non-monster card.
 * @param {Card} card - The card to apply the effect of.
 * @param {Object} target - The target of the effect (e.g., a card or field).
 */
function applyCardEffect(card, target) {
  if (!card || !target) {
    console.error("Invalid card or target!");
    return;
  }

  switch (card.cardType) {
    case "Energy":
      // Check if energy can be placed this turn
      if (!canPlaceEnergy()) {
        console.error("Energy can only be placed once per turn!");
        return;
      }

      // Add energy to a monster
      if (target.cardType === "Monster") {
        target.energy += card.energyAmount;
        target.energyType = card.energyType; // Set the energy type
        markEnergyPlaced(); // Mark that energy has been placed this turn

        // Add motion effect: Move energy card below the monster
        card.moveTo(target.x + 10, target.y + 90); // Offset diagonal bottom-right
        console.log(
          `Added ${card.energyAmount} ${card.energyType} energy to ${target.name}`
        );
      }
      break;
    case "Trainer":
      // Apply trainer card effect
      if (card.effect === "DrawCards") {
        drawCard();
        console.log("Drew a card using a Trainer card!");
      }
      break;
    default:
      console.error("Invalid card type for applying effects!");
  }
}
