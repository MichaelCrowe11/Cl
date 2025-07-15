module.exports = {
  hooks: {
    readPackage: (pkg) => {
      // Allow build scripts for these packages
      if (pkg.name === 'sharp' || pkg.name === 'unrs-resolver') {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};
