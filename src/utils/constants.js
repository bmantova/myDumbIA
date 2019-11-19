export default {
  GROUND: {
    SIZE: 500,
    SUB: 128,
    MAPS: {
      HEIGHT: {
        max: 0.06,
        n: 20,
        exp: 6
      },
      HUMIDITY: {
        max: 0.05,
        n: 20,
        exp: 4
      },
      TEMPERATURE: {
        max: 0.03,
        n: 20,
        exp: 2
      }
    }
  },
  RESSOURCES: {
    TYPES: {
      VEGETATION: 'vegetation',
      MEAT: 'meat'
    }
  }
}

// Attention, si on ajoute une constante mettre : /* ctrlconst */ su la ligne
