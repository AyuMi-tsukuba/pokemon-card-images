let selectedCard = null; // Track the selected card for drag-and-drop

// Event listener for selecting a card
canvas.addEventListener("mousedown", (event) => {
  const card = getCardAtPosition(event.offsetX, event.offsetY);
  if (card) {
    handleCardClick(card);
  }
});

// Function to handle card click
function handleCardClick(card) {
  if (card.cardType === "Energy") {
    // If the card is an Energy card, ask which monster to give energy to
    const monster = prompt(
      "Which monster will you give energy to? (Enter the monster's name)"
    );
    if (monster) {
      const targetMonster = findMonsterByName(monster);
      if (targetMonster) {
        useCard(card, "applyEffect", targetMonster);
      } else {
        alert("Monster not found!");
      }
    }
  } else if (card.cardType !== "Monster") {
    // If the card is not a Monster card, ask if the user wants to use it
    const useCard = confirm("Do you want to use this card?");
    if (useCard) {
      applyCardFunction(card);
    }
  } else {
    // If the card is a Monster card, ask if the user wants to use it
    const useCard = confirm("Do you want to use this card?");
    if (useCard) {
      // Handle Monster card usage (e.g., attack, defend, etc.)
      alert("Monster card selected. Implement your logic here.");
    }
  }
}

// Function to find a monster by name
function findMonsterByName(name) {
  // Search in the player's fields
  for (const key in fields) {
    if (fields[key] && fields[key].name === name) {
      return fields[key];
    }
  }
  // Search in the opponent's fields
  for (const key in vsFields) {
    if (vsFields[key] && vsFields[key].name === name) {
      return vsFields[key];
    }
  }
  return null;
}

// Function to apply card function for non-Monster cards
function applyCardFunction(card) {
  if (card.cardFunction) {
    // Implement the card function logic here
    alert(`Applying card function: ${card.cardFunction}`);
  } else {
    alert("This card has no function.");
  }
}

// Event listener for placing a card
canvas.addEventListener("mouseup", (event) => {
  if (selectedCard) {
    const target = getCardAtPosition(event.offsetX, event.offsetY);
    if (target && target.cardType === "Monster") {
      useCard(selectedCard, "applyEffect", target);
    } else {
      console.error("Invalid target for energy placement!");
    }
    selectedCard = null; // Clear the selected card
  }
});

// Event listener for attacking with a card
document.addEventListener("keydown", (event) => {
  if (event.key === "a") {
    const attacker = hand[0]; // Example: Use the first card in hand as the attacker
    const defender = vsFields.Battle; // Example: Attack the opponent's Battle field
    if (attacker && defender) {
      useCard(attacker, "attack", defender);
    } else {
      console.error("Invalid attacker or defender!");
    }
  }
});

// In events.js

let selectedMonster = null; // Track selected basic monster

// Modified handleCardClick function
function handleCardClick(card) {
  // First click - select basic monster
  if (!selectedMonster && isBasicMonster(card)) {
    selectedMonster = card;
    alert(`Selected ${card.name}. Now click on Battle or Bench position`);
    return;
  }

  // Second click - check field position
  if (selectedMonster) {
    const fieldPosition = getClickedFieldPosition(event.offsetX, event.offsetY);

    if (fieldPosition) {
      // Move monster to selected position
      selectedMonster.moveTo(fieldPosition.x, fieldPosition.y);

      // Update field reference (add this to your field management logic)
      updateFieldOccupation(selectedMonster, fieldPosition.type);

      alert(`${selectedMonster.name} moved to ${fieldPosition.type}`);
    } else {
      alert("Invalid placement position!");
    }

    selectedMonster = null; // Reset selection
    return;
  }

  // Original card type handling
  if (card.cardType === "Energy") {
    // ... existing energy handling ...
  }
  // ... rest of original card handling ...
}

// Add to utils.js
function getClickedFieldPosition(x, y) {
  const fieldTypes = ["fields", "vsFields"];

  for (const fieldType of fieldTypes) {
    for (const [key, pos] of Object.entries(positionsConfig[fieldType])) {
      if (x >= pos.x && x <= pos.x + 60 && y >= pos.y && y <= pos.y + 80) {
        return { x: pos.x, y: pos.y, type: `${fieldType}.${key}` };
      }
    }
  }
  return null;
}

function updateFieldOccupation(card, fieldPosition) {
  // Clear previous position
  for (const key in fields) {
    if (fields[key] === card) fields[key] = null;
  }
  for (const key in vsFields) {
    if (vsFields[key] === card) vsFields[key] = null;
  }

  // Set new position
  const [fieldType, fieldKey] = fieldPosition.split(".");
  if (fieldType === "fields") {
    fields[fieldKey] = card;
  } else {
    vsFields[fieldKey] = card;
  }
}
