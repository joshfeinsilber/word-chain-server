interface Power {
  id: string
  emoji: string
  background: string
  name: string
  description: string
  cost: number
}

export const PowerIds = {
  extraLife: "extra-life",
  pointsPerLetter: "pointers-per-letter",
  pointFromWin: "point-from-win",
  autoPoint: "auto-point",
  makeExpensive: "make-expensive",
  lessExpensive: "less-expensive"
}

const Powers: Power[] = [
  {
    id: PowerIds.extraLife,
    emoji: "💖",
    background: "#1a237e",
    name: "Heart",
    description: "Gain an extra life",
    cost: 600
  },
  {
    id: PowerIds.pointsPerLetter,
    emoji: "✏️",
    background: "#ffe0b2",
    name: "Point Plus",
    description: "Extra point per letter",
    cost: 350
  },
  {
    id: PowerIds.pointFromWin,
    emoji: "🎉",
    background: "#1b5e20",
    name: "Plus One",
    description: "Gain 10 points from another player's word",
    cost: 200
  },
  {
    id: PowerIds.autoPoint,
    emoji: "⏱️",
    background: "#546e7a",
    name: "AutoPoint",
    description: "Gain an extra 25 points every minute",
    cost: 100
  },
  {
    id: PowerIds.makeExpensive,
    emoji: "💰",
    background: "#6a1b9a",
    name: "Expensify",
    description: "Make powers 10% more expensive for others",
    cost: 300
  },
  {
    id: PowerIds.lessExpensive,
    emoji: "🔻",
    background: "#f48fb1",
    name: "Discount",
    description: "Make powers 10% less expensive for you",
    cost: 200
  }
]

export default Powers
