Template.accountShow.helpers({
  publishWithRank: function() {
    return this.publishedPosts.map(function (post, index, cursor) {
      post._rank = index;
      return post;
    });
  },
  recommendedWithRank: function() {
    return this.recommendedPosts.map(function (post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});
