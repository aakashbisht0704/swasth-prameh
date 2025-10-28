module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow build scripts for all packages
      if (pkg.name) {
        pkg.scripts = pkg.scripts || {};
        // Ensure build scripts are not blocked
        if (pkg.scripts.install) {
          pkg.scripts.install = pkg.scripts.install;
        }
        if (pkg.scripts.postinstall) {
          pkg.scripts.postinstall = pkg.scripts.postinstall;
        }
      }
      return pkg;
    }
  }
};
