class LanguageImage {
  static images = [
      {
          name: 'assembly.png',
          image: require('../../assets/Languages/assembly.png'),
      },
      {
          name: 'aws.png',
          image: require('../../assets/Languages/aws.png'),
      },
      {
          name: 'azure.png',
          image: require('../../assets/Languages/azure.png'),
      },
      {
          name: 'c.png',
          image: require('../../assets/Languages/c.png'),
      },
      {
          name: 'cisco.png',
          image: require('../../assets/Languages/cisco.png'),
      },
      {
          name: 'ciw.png',
          image: require('../../assets/Languages/ciw.png'),
      },
      {
          name: 'cpp.png',
          image: require('../../assets/Languages/cpp.png'),
      },
      {
          name: 'hackathon.png',
          image: require('../../assets/Languages/hackathon.png'),
      },
      {
          name: 'html.png',
          image: require('../../assets/Languages/html.png'),
      },
      {
          name: 'ibm_ml.png',
          image: require('../../assets/Languages/ibm_ml.png'),
      },
      {
        name: 'java_se.png',
        image: require('../../assets/Languages/java_se.png'),
    },
    {
        name: 'java.png',
        image: require('../../assets/Languages/java.png'),
    },
    {
        name: 'js.png',
        image: require('../../assets/Languages/js.png'),
    },
    {
        name: 'linkedin.png',
        image: require('../../assets/Languages/linkedin.png'),
    },
    {
        name: 'office.png',
        image: require('../../assets/Languages/office.png'),
    },
    {
        name: 'python.png',
        image: require('../../assets/Languages/python.png'),
    },
    {
        name: 'r.png',
        image: require('../../assets/Languages/r.png'),
    },
    {
        name: 'salesforce.png',
        image: require('../../assets/Languages/salesforce.png'),
    },
    {
        name: 'security_professional.png',
        image: require('../../assets/Languages/security_professional.png'),
    },
    {
        name: 'swift.png',
        image: require('../../assets/Languages/swift.png'),
    },
  ];

  static GetImage(name) {
      const found = LanguageImage.images.find(e => e.name === name);
      return found ? found.image : null;
  }
}

module.exports = { LanguageImage };
