/**
 * Created by zkf on 12/24/14.
 */
Meteor.methods({
    uploadFile: function (file) {
        check(file, MeteorFile);
        var fileExt = file.name.slice(-4);
        if(fileExt !== ".jpg"){
            throw new Meteor.Error("wrong image type", "only support .jpg");
        }
        if(file.size >= 100 * 1024){
            throw new Meteor.Error("image too large", "be sure the file is smaller than 100KB");
        }
        file.save('../../../../../public', this.userId + fileExt , {});
    }
});

Meteor.methods({
    getAvatarUrl: function (userId) {
        check(userId, String);
        var fs = Npm.require('fs');
        //var path = Npm.require('path');
        //if(fs.existsSync(path.join("/home/zkf/meteor/Jiangxinzhizao/public", userId + ".jpg")))
        if(fs.existsSync("../../../../../public/" + userId + ".jpg"))
            return true;
        else
            return false;
    }
});
