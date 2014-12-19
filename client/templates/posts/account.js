Template.account.helpers({
  publishWithRank: function() {
    return this.published.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});
