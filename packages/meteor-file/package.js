Package.describe({
  summary: "Simple file uploading for Meteor"
});

Package.on_use(function (api) {
  api.use(["ejson", "underscore"], ["client", "server"]);
  api.add_files(["meteor-file.js"], ["client", "server"]);
  if (typeof api.export !== 'undefined') {
    api.export("MeteorFile", ["client", "server"]);
  }
});
