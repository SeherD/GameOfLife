class AvatarImage {
  static images = [
      {
          name: 'Avatar1.png',
          image: require('../../assets/Avatars/Avatar1.png'),
      },
      {
          name: 'Avatar2.png',
          image: require('../../assets/Avatars/Avatar2.png'),
      },
      {
          name: 'Avatar3.png',
          image: require('../../assets/Avatars/Avatar3.png'),
      },
      {
          name: 'Avatar4.png',
          image: require('../../assets/Avatars/Avatar4.png'),
      },
      {
          name: 'Avatar5.png',
          image: require('../../assets/Avatars/Avatar5.png'),
      },
      {
          name: 'Avatar6.png',
          image: require('../../assets/Avatars/Avatar6.png'),
      },
      {
          name: 'Avatar7.png',
          image: require('../../assets/Avatars/Avatar7.png'),
      },
      {
          name: 'Avatar8.png',
          image: require('../../assets/Avatars/Avatar8.png'),
      },
  ];

  static GetImage(name) {
      const found = AvatarImage.images.find(e => e.name === name);
      return found ? found.image : null;
  }
}

module.exports = { AvatarImage };
