Handlebars.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});

//var avatarUrlDict = {};

Handlebars.registerHelper('avatarUrl', function(userId) {
  // fairly stupid pluralizer
  var key = "avatarUrl_"+userId;
  if (Session.get(key))
    return Session.get(key);
  else {
    Meteor.call("getAvatarUrl", userId, function(err, result){
      if(result)
        Session.set(key, "/" + userId + ".jpg");
      else
        Session.set(key, "/default.jpg");
    });

    return Session.get(key);
  }
});