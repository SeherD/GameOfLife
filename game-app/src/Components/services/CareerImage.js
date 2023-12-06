class CareerImage {
  static images = [
      {
          name: 'ai_special.jpg',
          image: require('../../assets/Careers/ai_special.jpg'),
      },
      {
          name: 'consultant.jpg',
          image: require('../../assets/Careers/consultant.jpg'),
      },
      {
          name: 'cyber.jpg',
          image: require('../../assets/Careers/cyber.jpg'),
      },
      {
          name: 'dataanalyst.jpg',
          image: require('../../assets/Careers/dataanalyst.jpg'),
      },
      {
          name: 'databaseadmin.jpg',
          image: require('../../assets/Careers/databaseadmin.jpg'),
      },
      {
          name: 'fullstack.jpg',
          image: require('../../assets/Careers/fullstack.jpg'),
      },
      {
          name: 'gptprompter.jpg',
          image: require('../../assets/Careers/gptprompter.jpg'),
      },
      {
          name: 'gpu.jpg',
          image: require('../../assets/Careers/gpu.jpg'),
      },
      {
          name: 'hacker.jpg',
          image: require('../../assets/Careers/hacker.jpg'),
      },
      {
          name: 'machine_engineer.jpg',
          image: require('../../assets/Careers/machine_engineer.jpg'),
      },
      {
        name: 'qa.jpg',
        image: require('../../assets/Careers/qa.jpg'),
    },
    {
        name: 'sde.jpg',
        image: require('../../assets/Careers/sde.jpg'),
    },
    {
        name: 'sysadmin.jpg',
        image: require('../../assets/Careers/sysadmin.jpg'),
    },
    {
        name: 'techwriter.jpg',
        image: require('../../assets/Careers/techwriter.jpg'),
    },
    {
        name: 'webdev.jpg',
        image: require('../../assets/Careers/webdev.jpg'),
    },
  ];

  static GetImage(name) {
      const found = CareerImage.images.find(e => e.name === name);
      return found ? found.image : null;
  }
}

module.exports = { CareerImage };
