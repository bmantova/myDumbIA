export default {
  GROUND: {
    SIZE: 500,
    SUB: 128,
    MAPS: {
      HEIGHT: {
        max: 0.06,
        n: 20,
        exp: 7
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
    },
    REPRODUCTION: {
      DELTA_MAX_DIFFERENCE: 5
    },
    VEGETATION: {
      FALLING_TIME: 200,
      MAX_TREES: 2000
    }
  },
  TIME: {
    SPEED: 1.0
  },
  SUITS: {
    HEIGHT: [
      {
        max: 0.2,
        name: 'abysse',
        ADN: {
          capacity: {
            swim: 1,
            breathing: 1,
            fly: 0,
            sight: 0.1
          },
          morphology: {
            fur: 0,
            arms: 0,
            legs: 0,
            feet: 0
          }
        }
      },
      {
        max: 0.4,
        name: 'mer',
        ADN: {
          capacity: {
            swim: 0.8,
            breathing: 0.6,
            fly: 0.1,
            sight: 0.3
          },
          morphology: {
            fur: 0,
            arms: 0.2,
            legs: 0.3,
            feet: 0.1
          }
        }
      },
      {
        max: 0.6,
        name: 'plage',
        ADN: {
          capacity: {
            swim: 0.5,
            breathing: 0.4,
            fly: 0.3,
            sight: 0.5
          },
          morphology: {
            fur: 0.2,
            arms: 0.8,
            legs: 0.4,
            feet: 0.5
          }
        }
      },
      {
        max: 0.8,
        name: 'coline',
        ADN: {
          capacity: {
            swim: 0.2,
            breathing: 0.3,
            fly: 0.5,
            sight: 0.7
          },
          morphology: {
            fur: 0.5,
            arms: 0.5,
            legs: 0.6,
            feet: 0.6
          }
        }
      },
      {
        max: 1,
        name: 'montagne',
        ADN: {
          capacity: {
            swim: 0,
            breathing: 0,
            fly: 0.9,
            sight: 0.9
          },
          morphology: {
            fur: 0.8,
            arms: 0.4,
            legs: 0.6,
            feet: 0.8
          }
        }
      }
    ],
    HUMIDITY: [
      {
        max: 0.33,
        name: 'sec',
        ADN: {
          capacity: {
            swim: 0,
            breathing: 0,
            fly: 0.2,
            sight: 0.2
          },
          morphology: {
            fur: 0.1,
            arms: 0.5,
            legs: 0.7,
            feet: 0.2
          }
        }
      },
      {
        max: 0.66,
        name: 'tempere',
        ADN: {
          capacity: {
            swim: 0.4,
            breathing: 0.4,
            fly: 0.5,
            sight: 0.5
          },
          morphology: {
            fur: 0.3,
            arms: 0.5,
            legs: 0.4,
            feet: 0.6
          }
        }
      },
      {
        max: 1,
        name: 'humide',
        ADN: {
          capacity: {
            swim: 0.8,
            breathing: 0.8,
            fly: 0.8,
            sight: 0.8
          },
          morphology: {
            fur: 0.6,
            arms: 0.6,
            legs: 0.3,
            feet: 0.1
          }
        }
      }
    ],
    TEMPERATURE: [
      {
        max: 1,
        name: 'froid',
        ADN: {
          capacity: {
            swim: 0.5,
            breathing: 0.5,
            fly: 0.2,
            sight: 0.5
          },
          morphology: {
            fur: 1,
            arms: 0.2,
            legs: 0.6,
            feet: 0.3
          }
        }
      },
      {
        max: 1,
        name: 'tempere',
        ADN: {
          capacity: {
            swim: 0.4,
            breathing: 0.3,
            fly: 0.5,
            sight: 0.8
          },
          morphology: {
            fur: 0.5,
            arms: 0.1,
            legs: 0.3,
            feet: 0.9
          }
        }
      },
      {
        max: 1,
        name: 'chaud',
        ADN: {
          capacity: {
            swim: 0.5,
            breathing: 0.5,
            fly: 0.6,
            sight: 0.7
          },
          morphology: {
            fur: 0.1,
            arms: 0.8,
            legs: 0.8,
            feet: 0.1
          }
        }
      }
    ]
  }
}

// Attention, si on ajoute une constante mettre : /* ctrlconst */ su la ligne
