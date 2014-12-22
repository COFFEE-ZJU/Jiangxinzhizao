Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

AccountShowController = RouteController.extend({
  template: 'accountShow',
  sort: {submitted: -1, _id: -1},
  subscriptions: function() {
    this.subscribe('userInfo', this.userId());
    this.postsSub = Meteor.subscribe('relatedPosts', this.userId());
  },
  publishedPosts: function() {
    return Posts.find({userId: this.userId()}, {sort: this.sort});
  },
  recommendedPosts: function() {
    return Posts.find({upvoters: this.userId()}, {sort: this.sort});
  },
  userId: function() {
    return this.params.userId || Meteor.userId();
  },
  userName: function() {
    var user = Meteor.users.findOne({_id: this.userId()});
    return user ? (user.profile.name || user.username) : '';
  },
  data: function() {
    var hasMore = false;
    return {
      userId: this.userId(),
      userName: this.userName(),
      publishedPosts: this.publishedPosts(),
      recommendedPosts: this.recommendedPosts(),
      ready: this.postsSub.ready,
      nextPath: null
    };
  }
});

Router.route('/', {
  name: 'home',
  controller: BestPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});


Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() {
    var post = Posts.findOne(this.params._id);
    if(post) {
      post.dispContent = true;
    }
    return post;
  }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'postSubmit'});

Router.route('/account/:userId?', {name: 'accountShow'});

Router.route('/setting', {name: 'accountSetting'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
