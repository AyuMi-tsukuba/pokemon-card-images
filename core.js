// Canvas & Game Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 650;
canvas.height = 600;

// Configuration Object for Positions
const positionsConfig = {
  deck: { x: 10, y: 210, spacing: 0.1 },
  hand: { startX: 10, startY: 10, spacing: 60 },
  vsDeck: { x: 580, y: 310, spacing: 0.1 },
  vsHand: { startX: 10, startY: 500, spacing: 60 },

  fields: {
    Battle: { x: 295, y: 210 },
    Bench1: { x: 173, y: 110 },
    Bench2: { x: 234, y: 110 },
    Bench3: { x: 295, y: 110 },
    Bench4: { x: 356, y: 110 },
    Bench5: { x: 417, y: 110 },
  },
  vsFields: {
    Battle: { x: 295, y: 310 },
    Bench1: { x: 173, y: 410 },
    Bench2: { x: 234, y: 410 },
    Bench3: { x: 295, y: 410 },
    Bench4: { x: 356, y: 410 },
    Bench5: { x: 417, y: 410 },
  },
  prizes: [
    { x: 580, y: 110, spacing: 50 },
    { x: 560, y: 110, spacing: 50 },
  ],
  vsPrizes: [
    { x: 30, y: 310, spacing: 50 },
    { x: 10, y: 310, spacing: 50 },
  ],
  fieldsSp: {
    Yamafuda: { x: 10, y: 210 },
    Trash: { x: 10, y: 110 },
  },
  vsFieldsSp: {
    Yamafuda: { x: 580, y: 310 },
    Trash: { x: 580, y: 410 },
  },
};

// Deck and Hand Variables
let deck = [],
  hand = [],
  prizes = [];
let vsDeck = [],
  vsHand = [],
  vsPrizes = [];

// Fields for Player and Opponent
let fields = {
  Battle: null,
  Bench1: null,
  Bench2: null,
  Bench3: null,
  Bench4: null,
  Bench5: null,
};
let fieldsSp = {
  Yamafuda: null,
  Trash: null,
};
let vsFields = {
  Battle: null,
  Bench1: null,
  Bench2: null,
  Bench3: null,
  Bench4: null,
  Bench5: null,
};
let vsFieldsSp = {
  Yamafuda: null,
  Trash: null,
};

// Card Class
class Card {
  constructor(x, y, color, number) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 80;
    this.color = color;
    this.number = number;
    this.targetX = x;
    this.targetY = y;
    this.speed = 0.5;

    // Card properties
    this.name = "";
    this.cardType = "";
    this.state = "";
    this.evolvesFrom = "";
    this.cardFunction = "";
    this.monsterHP = "";
    this.Skill1DMG = "";
    this.Skill1EnergyQty = "";
    this.Skill1EnergyType = "";
    this.Skill1Effect = "";
    this.Skill2DMG = "";
    this.Skill2EnergyQty = "";
    this.Skill2EnergyType = "";
    this.Skill2Effect = "";

    this.image = new Image();
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
    this.image.onerror = () => {
      console.error(`Failed to load image: ${this.image.src}`);
      this.image.src = "images/cards/BackCard.png"; // Fallback to back card image
      this.imageLoaded = true; // Mark image as loaded
    };
    this.image.src = "images/cards/BackCard.png"; // Default back card image
    this.hover = false;
  }

  draw() {
    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback: Draw a placeholder rectangle
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  moveTo(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
  }

  update() {
    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;
  }
}

// Initialize Game
function initializeGame() {
  drawFields();
  deck = [];
  hand = [];
  prizes = [];
  vsDeck = [];
  vsHand = [];
  vsPrizes = [];
  fields = {
    Battle: null,
    Bench1: null,
    Bench2: null,
    Bench3: null,
    Bench4: null,
    Bench5: null,
  };
  fieldsSp = {
    Yamafuda: null,
    Trash: null,
  };
  vsFields = {
    Battle: null,
    Bench1: null,
    Bench2: null,
    Bench3: null,
    Bench4: null,
    Bench5: null,
  };
  vsFieldsSp = {
    Yamafuda: null,
    Trash: null,
  };

  for (let i = 0; i < 60; i++) {
    deck.push(
      new Card(
        positionsConfig.deck.x,
        positionsConfig.deck.y + i * positionsConfig.deck.spacing,
        "",
        i + 1
      )
    );
    vsDeck.push(
      new Card(
        positionsConfig.vsDeck.x,
        positionsConfig.vsDeck.y + i * positionsConfig.vsDeck.spacing,
        "",
        i + 1
      )
    );
  }
  document.getElementById("runButton").disabled = false;
}

// Shuffle Deck
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
  deck.forEach((card, index) =>
    card.moveTo(
      positionsConfig.deck.x,
      positionsConfig.deck.y + index * positionsConfig.deck.spacing
    )
  );

  for (let i = 0; i < vsDeck.length; i++) {
    let randomIndex = Math.floor(Math.random() * vsDeck.length);
    [vsDeck[i], vsDeck[randomIndex]] = [vsDeck[randomIndex], vsDeck[i]];
  }
  vsDeck.forEach((card, index) =>
    card.moveTo(
      positionsConfig.vsDeck.x,
      positionsConfig.vsDeck.y + index * positionsConfig.vsDeck.spacing
    )
  );
}

// Draw Card
async function drawCard() {
  if (deck.length > 0) {
    let card = deck.pop();
    card.moveTo(
      positionsConfig.hand.startX + hand.length * positionsConfig.hand.spacing,
      positionsConfig.hand.startY
    );
    hand.push(card);

    // Fetch card details
    const cardData = await fetchCardName(card.number);
    card.name = cardData.name || "Unknown";
    card.cardType = cardData.cardType || ""; // Monster or other
    card.state = cardData.state || ""; // Basic or Evolution
    card.monsterHP = cardData.monsterHP || "";
    card.evolvesFrom = cardData.evolvesFrom || "";
    card.cardFunction = cardData.cardFunction || "";
    card.Skill1DMG = cardData.Skill1DMG || "";
    card.Skill1EnergyQty = cardData.Skill1EnergyQty || "";
    card.Skill1EnergyType = cardData.Skill1EnergyType || "";
    card.Skill1Effect = cardData.Skill1Effect || "";
    card.Skill2DMG = cardData.Skill2DMG || "";
    card.Skill2EnergyQty = cardData.Skill2EnergyQty || "";
    card.Skill2EnergyType = cardData.Skill2EnergyType || "";
    card.Skill2Effect = cardData.Skill2Effect || "";
    card.image.src = cardData.imageUrl; // Set the image source

    document.getElementById("cardDisplay").innerText = `Drawn Card: ${
      card.name
    } (ID: ${card.number}) 
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

    rearrangeHand(); // Rearranging hand after drawing a card
  }
}

// Draw vs Card
async function drawvsCard() {
  if (vsDeck.length > 0) {
    let card = vsDeck.pop();
    card.moveTo(
      positionsConfig.vsHand.startX +
        vsHand.length * positionsConfig.vsHand.spacing,
      positionsConfig.vsHand.startY
    );
    vsHand.push(card);

    // Fetch card details
    const cardData = await fetchCardName(card.number);
    card.name = cardData.name || "Unknown";
    card.cardType = cardData.cardType || ""; // Monster or other
    card.state = cardData.state || ""; // Basic or Evolution
    card.image.src = cardData.imageUrl; // Set the image source

    rearrangevsHand(); // Rearranging hand after drawing a card
  }
}

// Rearrange Cards in Hand
function rearrangeHand() {
  hand.forEach((card, index) => {
    const xPos =
      positionsConfig.hand.startX + index * positionsConfig.hand.spacing;
    const yPos = positionsConfig.hand.startY;
    card.moveTo(xPos, yPos);
  });
  vsHand.forEach((card, index) => {
    const xPos =
      positionsConfig.vsHand.startX + index * positionsConfig.vsHand.spacing;
    const yPos = positionsConfig.vsHand.startY;
    card.moveTo(xPos, yPos);
  });
}
// Run Game (Shuffle Deck, Draw Initial Cards, Set Prizes)
async function runGame() {
  shuffleDeck();
  for (let i = 0; i < 7; i++) await drawCard();
  for (let i = 0; i < 7; i++) await drawvsCard();

  // Check if there are any valid Basic Monster cards
  if (
    !hand.some(
      (card) => card.cardType === "Monster" && card.state === "Basic"
    ) ||
    !vsHand.some(
      (card) => card.cardType === "Monster" && card.state === "Basic"
    )
  ) {
    alert("No Basic Monster Pokémon available! Please restart the game.");
    resetGame();
    return;
  }

  for (let i = 0; i < 3; i++) {
    let card = deck.pop();
    card.moveTo(
      positionsConfig.prizes[0].x,
      positionsConfig.prizes[0].y + i * positionsConfig.prizes[0].spacing
    );
    prizes.push(card);
  }
  for (let i = 0; i < 3; i++) {
    let card = deck.pop();
    card.moveTo(
      positionsConfig.prizes[1].x,
      positionsConfig.prizes[1].y + i * positionsConfig.prizes[1].spacing
    );
    prizes.push(card);
  }

  for (let i = 0; i < 3; i++) {
    let card = vsDeck.pop();
    card.moveTo(
      positionsConfig.vsPrizes[0].x,
      positionsConfig.vsPrizes[0].y + i * positionsConfig.vsPrizes[0].spacing
    );
    vsPrizes.push(card);
  }
  for (let i = 0; i < 3; i++) {
    let card = vsDeck.pop();
    card.moveTo(
      positionsConfig.vsPrizes[1].x,
      positionsConfig.vsPrizes[1].y + i * positionsConfig.vsPrizes[1].spacing
    );
    vsPrizes.push(card);
  }

  document.getElementById("runButton").disabled = true;
}

// Reset Game
function resetGame() {
  initializeGame();
}
// In core.js or main game file
initializeGame();
update(); // Start the rendering loop
