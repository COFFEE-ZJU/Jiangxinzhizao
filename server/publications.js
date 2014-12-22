Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('relatedPosts', function(userId){
  check(userId, String);
  return Posts.find({$or: [{userId: userId}, {upvoters: userId}]});
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});


Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('userInfo', function(userId){
  check(userId, String);
  return Meteor.users.find({_id: userId});
});
