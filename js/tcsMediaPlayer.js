var mplayer = {};

mplayer.playlist = ["colgate_2.mp4","kumho_1.mp4","levis_2.mp4"];
mplayer.sequenceIndex = 0;
mplayer.sequenceTotal = mplayer.playlist.length;
mplayer.mContainerWrapper;
mplayer.interval;// = setInterval(framecheck,30);
mplayer.timeout;
mplayer.videoPlayer;
mplayer.imgPlayer;
mplayer.currentPlayer;
mplayer.syncmode = false;
mplayer.syncmodeMaster = false;
mplayer.istransition = false;
mplayer.vstatus;

mplayer.init = function(){
  document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
  document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
  document.addEventListener("onSocketError",this.onSocketError.bind(this),false);
  document.addEventListener("onSocketOpen",this.onSocketOpen.bind(this),false);
  this.mContainerWrapper =  $$("mContainerWrapper");
  this.vstatus = $$("vstatus");
}

mplayer.minVideo = function(){
  TweenMax.to( this.mContainerWrapper,1,{width:"20%",height:"20%"});
 }
mplayer.maxVideo = function(){
  TweenMax.to( this.mContainerWrapper,1,{width:"100%",height:"100%"});
 }

 mplayer.pageInit = function(){
  this.syncmodeMaster = false;//conf.IS_MASTER=="Y"?true:false;
  this.playSequence(-1);
 }

mplayer.framecheck = function(){
   var logTxt = "";
   var current = this.videoPlayer.currentTime;
   var duration = this.videoPlayer.duration;
   if(duration!=NaN && duration>1.0 && current>1.0){
      logTxt =  current+"/"+duration;
      if(duration - current<1){
        clearInterval(this.interval);
        this.masterSequenceAction();
      }
   }
   this.vstatus.innerHTML = logTxt;
 }
 mplayer.imageframeCheck = function(){
   this.masterSequenceAction();
 }
mplayer.masterSequenceAction = function(){
   if(this.syncmode){
     if(this.syncmodeMaster){
       tcsapp.tcssocket.send("ALL","SEQUENCE_PLAY",(parseInt(this.sequenceIndex)+1));
     }
   }else{
     this.dimoutCurrent(-1);
   }
 }
mplayer.dimoutCurrent = function(n){
   this.istransition = true;
   TweenMax.to(this.currentPlayer,1,{opacity:"0"});
   this.timeout = setTimeout(this.playSequence.bind(this),1000,n);
 }


 mplayer.playSequence = function(n){
   if(this.currentPlayer){
     if(this.videoPlayer == this.currentPlayer){
        this.videoPlayer.pause();
        this.mContainerWrapper.removeChild(this.videoPlayer);
        delete this.videoPlayer;
     }else{
        this.mContainerWrapper.removeChild(this.imgPlayer);
        delete this.imgPlayer;
     }
   }

   if(n<0){
     this.sequenceIndex++;
   }else{
     this.sequenceIndex = n;
   }
   if(this.sequenceIndex == this.sequenceTotal)this.sequenceIndex = 0;

   var mediaUrl = this.playlist[this.sequenceIndex];
   if(mediaUrl.substring(mediaUrl.lastIndexOf(".")+1) == "mp4"){
     this.videoPlayer = document.createElement("video");
     this.videoPlayer.src = "./media/"+mediaUrl;
     this.videoPlayer.load();
     this.videoPlayer.play();
     this.videoPlayer.volume = 0.0;
     TweenMax.from(this.videoPlayer,1,{opacity:"0"});
     this.interval = setInterval(this.framecheck.bind(this),30);
     this.currentPlayer = this.videoPlayer;
     this.mContainerWrapper.appendChild(this.currentPlayer);

   }else{
     this.imgPlayer = document.createElement("img");
     this.imgPlayer.src = "./media/"+mediaUrl;
     TweenMax.from(this.imgPlayer,1,{opacity:"0"});
     this.timeout = setTimeout(this.imageframeCheck.bind(this),5000);
     this.currentPlayer = this.imgPlayer;
     this.mContainerWrapper.appendChild(this.currentPlayer);
   }

 }

 mplayer.onSocketOpen = function(e){
   //this.syncmode = true;
 }
 mplayer.onSocketError = function(e){
   //this.syncmode = false;
 }
 mplayer.onSocketClose = function(e){
   //this.syncmode = false;
 }
mplayer.onSocketMessage = function(e){
  console.log("e.detail.cmd : "+e.detail.cmd+":"+e.detail.msg);
  if(e.detail.cmd == "SEQUENCE_PLAY"){
      this.dimoutCurrent(e.detail.msg);
  }
}
