class HouseImage {
  static images = [
      {
          name: 'apartment.jpg',
          image: require('../../assets/Houses/apartment.jpg'),
      },
      {
          name: 'beach_house.jpg',
          image: require('../../assets/Houses/beach_house.jpg'),
      },
      {
          name: 'bungalow.jpg',
          image: require('../../assets/Houses/bungalow.jpg'),
      },
      {
          name: 'cabin.jpg',
          image: require('../../assets/Houses/cabin.jpg'),
      },
      {
          name: 'cottage.jpg',
          image: require('../../assets/Houses/cottage.jpg'),
      },
      {
          name: 'desert_oasis.jpg',
          image: require('../../assets/Houses/desert_oasis.jpg'),
      },
      {
          name: 'farmhouse.jpg',
          image: require('../../assets/Houses/farmhouse.jpg'),
      },
      {
          name: 'lakefront.jpg',
          image: require('../../assets/Houses/lakefront.jpg'),
      },
      {
          name: 'loft.jpg',
          image: require('../../assets/Houses/loft.jpg'),
      },
      {
          name: 'manor.jpg',
          image: require('../../assets/Houses/manor.jpg'),
      },
      {
        name: 'mansion.jpg',
        image: require('../../assets/Houses/mansion.jpg'),
    },
    {
        name: 'mountain_retreat.jpg',
        image: require('../../assets/Houses/mountain_retreat.jpg'),
    },
    {
        name: 'penthouse.jpg',
        image: require('../../assets/Houses/penthouse.jpg'),
    },
    {
        name: 'treehouse.jpg',
        image: require('../../assets/Houses/treehouse.jpg'),
    },
    {
        name: 'villa.jpg',
        image: require('../../assets/Houses/villa.jpg'),
    },
  ];

  static GetImage(name) {
      const found = HouseImage.images.find(e => e.name === name);
      return found ? found.image : null;
  }
}

module.exports = { HouseImage };
