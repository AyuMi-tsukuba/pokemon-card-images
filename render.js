// Rendering and UI Updates
cardWidth = 60;
cardHeight = 80;
/**
 * Draws all fields (player and opponent) on the canvas.
 */
function drawFields() {
  ctx.fillStyle = "black";
  // Draw player fields
  for (let field in fields) {
    let xPos = positionsConfig.fields[field].x;
    let yPos = positionsConfig.fields[field].y;
    ctx.strokeRect(xPos, yPos, cardWidth, cardHeight);
    ctx.fillText(field, xPos + 7, yPos - 5);
  }
  // Draw vs fields
  for (let field in vsFields) {
    let xPos = positionsConfig.vsFields[field].x;
    let yPos = positionsConfig.vsFields[field].y;
    ctx.strokeRect(xPos, yPos, cardWidth, cardHeight);
    ctx.fillText(field, xPos + 7, yPos - 5);
  }
}

/**
 * Draws all cards on the canvas (deck, hand, prizes, fields).
 */
function drawCards() {
  // Draw cards from the deck, hand, prizes, and fields
  deck.forEach((card) => card.draw());
  hand.forEach((card) => {
    if (card.hover) {
      card.moveTo(card.targetX, card.targetY - 10); // Move card up when hovered
    } else {
      card.moveTo(card.targetX, card.targetY); // Return to original position
    }
    card.update();
    card.draw();
  });
  prizes.forEach((card) => {
    card.update();
    card.draw();
  });

  // Draw vs's cards from the deck, hand, prizes, and fields
  vsDeck.forEach((card) => card.draw());
  vsHand.forEach((card) => {
    card.update();
    card.draw();
  });
  vsPrizes.forEach((card) => {
    card.update();
    card.draw();
  });

  // Draw player's cards in fields
  Object.values(fields).forEach((card) => {
    if (card) {
      card.update();
      card.draw();
    }
  });

  // Draw vs's cards in fields
  Object.values(vsFields).forEach((card) => {
    if (card) {
      card.update();
      card.draw();
    }
  });

  // Check if the deck is empty and all cards are drawn
  if (
    deck.length === 0 &&
    hand.length === 0 &&
    prizes.length === 0 &&
    Object.values(fields).every((field) => field === null)
  ) {
    // Move all cards back to the deck
    moveAllCardsToDeck();
  }
}

/**
 * Place a card on the field for a specific player.
 * @param {Card} card - The card to place.
 * @param {string} fieldType - The field to place the card on (e.g., "Battle", "Bench1").
 * @param {string} player - The player placing the card ("me" or "vs").
 */
function placeCard(card, fieldType, player) {
  if (!card || !fieldType || !player) {
    console.error("Invalid card, field type, or player!");
    return;
  }

  // Determine the correct field and hand based on the player
  const playerFields = player === "me" ? fields : vsFields;
  const playerHand = player === "me" ? hand : vsHand;
  const playerPositions =
    player === "me" ? positionsConfig.fields : positionsConfig.vsFields;

  // Check if the card is a Basic Monster
  if (card.cardType === "Monster" && card.state === "Basic") {
    if (!playerFields[fieldType]) {
      // Place the card on the field
      playerFields[fieldType] = card;
      card.moveTo(playerPositions[fieldType].x, playerPositions[fieldType].y);

      // Remove the card from the hand
      const cardIndex = playerHand.findIndex((c) => c.number === card.number);
      if (cardIndex !== -1) {
        playerHand.splice(cardIndex, 1);
        rearrangeHand(player);
      }
    } else {
      console.error(`Field ${fieldType} is already occupied for ${player}!`);
    }
  } else {
    console.error("Only Basic Monster cards can be placed on the field!");
  }
}

/**
 * Automatically find and place the first available Basic Monster card.
 * @param {string} player - The player ("me" or "vs").
 * @param {string} fieldType - The field to place the card on.
 */
function autoPlaceMonster(player, fieldType) {
  // Get the player's hand
  const playerHand = player === "me" ? hand : vsHand;

  // Find the first available Basic Monster card
  let chosenCard = playerHand.find(
    (card) => card.cardType === "Monster" && card.state === "Basic"
  );

  if (chosenCard) {
    placeCard(chosenCard, fieldType, player);
  } else {
    console.log(`No valid Monster card available for ${player}!`);
  }
}

// Example usage
function mePlaceBattleMonster() {
  autoPlaceMonster("me", "Battle"); // Automatically places a valid card for the player
  rearrangeHand("me");
}

function vsPlaceBattleMonster() {
  autoPlaceMonster("vs", "Battle"); // Automatically places a valid card for the opponent
  rearrangeHand("vs");
}

/**
 * Automatically find and place a Basic Monster card on the first available Bench spot.
 * @param {string} player - The player ("me" or "vs").
 */
function autoPlaceMonsterOnBench(player) {
  // Get the player's field and hand
  const playerHand = player === "me" ? hand : vsHand;
  const playerFields = player === "me" ? fields : vsFields;

  // Find the first available Basic Monster card
  let chosenCard = playerHand.find(
    (card) => card.cardType === "Monster" && card.state === "Basic"
  );

  if (!chosenCard) {
    console.log(`No valid Monster card available for ${player}!`);
    return;
  }

  // Find the first available Bench slot dynamically
  const availableBench = Object.keys(playerFields).find(
    (field) => field.startsWith("Bench") && !playerFields[field]
  );

  if (availableBench) {
    placeCard(chosenCard, availableBench, player);
  } else {
    console.log(`No available Bench space for ${player}!`);
  }
}

function mePlaceBenchMonster() {
  autoPlaceMonsterOnBench("me"); // Automatically places a valid card for the player
  rearrangeHand("me");
}

function vsPlaceBenchMonster() {
  autoPlaceMonsterOnBench("vs"); // Automatically places a valid card for the opponent
  rearrangeHand("vs");
}
/**
 * Updates the game state and re-renders the canvas.
 */
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFields();
  drawCards();
  requestAnimationFrame(update);
}

/**
 * Updates the card display in the UI with the details of the selected card.
 * @param {Card} card - The card to display.
 */
function updateCardDisplay(card) {
  document.getElementById("cardDisplay").innerText = `Card: ${card.name} (ID: ${
    card.number
  }) 
    - Type: ${card.cardType} 
    - State: ${card.state} 
    - monsterHP: ${card.monsterHP} 
    - Evolves From: ${card.evolvesFrom || "None"} 
    - Function: ${card.cardFunction || "None"} 
  
    Skill 1: 
    - DMG: ${card.Skill1DMG} 
    - Energy: ${card.Skill1EnergyQty} ${card.Skill1EnergyType} 
    - Effect: ${card.Skill1Effect || "None"} 
  
    Skill 2: 
    - DMG: ${card.Skill2DMG} 
    - Energy: ${card.Skill2EnergyQty} ${card.Skill2EnergyType} 
    - Effect: ${card.Skill2Effect || "None"}`;
}
