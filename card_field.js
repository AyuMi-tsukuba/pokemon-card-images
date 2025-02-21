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

// Function to draw field positions on the canvas
function drawField(ctx) {
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";

  // Draw all field positions
  Object.entries(positionsConfig).forEach(([category, positions]) => {
    if (Array.isArray(positions)) {
      // Handle prize card positions
      positions.forEach((pos, index) => {
        ctx.strokeRect(pos.x, pos.y, 60, 80);
        ctx.fillText(`${category} ${index + 1}`, pos.x + 5, pos.y + 15);
      });
    } else {
      // Handle other field areas
      Object.entries(positions).forEach(([key, pos]) => {
        ctx.strokeRect(pos.x, pos.y, 60, 80);
        ctx.fillText(`${category} ${key}`, pos.x + 5, pos.y + 15);
      });
    }
  });
}
