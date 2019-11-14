export default {
  GROUND: {
    SIZE: 100,
    SUB: 512,
    MAPS: {
      HEIGHT: {
        max: 0.06,
        n: 20,
        exp: 6
      },
      HUMIDITY: {
        max: 0.05,
        n: 20,
        exp: 3
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
