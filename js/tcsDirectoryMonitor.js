var dm = {};

dm.init = function(){

  this.chokidar = require('chokidar');
  this.path     = require('path');
  this.fs       = require("fs");
  this.maxnum = 20;
  this.files = [];
  this.exts = [".JPG",".MP4"];
  this.cnt = 0;
  this.root = tcsapp.conf.ROOT_PATH+'/Temp/';

  //
  // var dirwatch = require("./js/DirectoryWatcher.js");
  // var dirMonitor = new dirwatch.DirectoryWatcher(this.root, true);
  // dirMonitor.directoryStructure
  // dirMonitor.start(100);
  // dirMonitor.on("fileAdded", function (fileDetail) {
  //   console.log("File Added: " + fileDetail.fullPath);
  // });

  this.fs.readdir(this.root, (err, items)=>{


      var tmpBt = 0;
      for (var i=0; i<items.length; i++) {
        var fpath = this.root+items[i];
          //  console.log("fpath : "+fpath);

            if(this.cnt<this.maxnum && this.inspectExt(fpath,this.exts) && !this.chkSize(fpath)){
                this.files.push(items[i]);
            }else{
                this.fs.unlink(fpath,function(err){
                  //  console.log(err);
                });
            }
            this.cnt++;
            this.fs.stat(this.root+items[i],(err,data)=>{
            //  console.log(data+":"+data.birthtime);
              //console.log(data);
            });
      }
      this.cnt = 0;
      //console.log(this.files);
  });



  var watcher = this.chokidar.watch(this.root, {ignored: /(^|[\/\\])\../}).on('all', (event, fpath) => {
      //this.logFFmpeg("event : "+event);
      //if(!tcsapp.isGameRunning)return;

      if(event == "add"){


        if (this.inspectExt(fpath,this.exts) && !this.chkSize(fpath) && this.files.indexOf(this.path.basename(fpath))<0){
            this.files.push(fpath);
            if(this.files.length>this.maxnum){
              var deleteTarget = this.files.shift();
              this.fs.unlink(this.root+deleteTarget,function(err){
                  //console.log(err);
              });
            }
          //  console.log("new added  : "+this.path.basename(fpath));
        }
      }
    })

    return true;
}

dm.chkSize = function(file){
  this.fs.stat(file,(err,data)=>{
    //console.log("data.size : "+data.size);
    if(data.size>0)return true;
  });
  return false;
};

dm.inspectExt = function(file,exts){
  var extStr = dm.path.extname(file).toUpperCase();
  //console.log("extStr : "+extStr);
  for(var i = 0;i<exts.length;i++){
    if(exts[i] === extStr){
      return true;
    }
  }
  return false;
}
