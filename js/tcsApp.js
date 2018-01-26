	var tcsapp = function(){

	}

	tcsapp.pages = [];
	tcsapp.previouspage = 0;
  tcsapp.currentpage = 0;

  tcsapp.isGameRunning = false;
	tcsapp.isGameReady = false;

  tcsapp.tcssocket = null;
	tcsapp.conf = null;
	tcsapp.debug = null;



	tcsapp.init = function(){

			this.debug = new PanelDebug('panelDebug');
	    this.debug.init();

			this.conf = new PanelConf('panelConf');
			this.conf.init();

			this.tcssocket = new TCSWebSocket();

			if(this.conf.initialReady){
				this.connectSocket();

			}else{
				this.conf.show();

			}
			this.paging(0);
	}


	tcsapp.connectSocket = function(){
		this.tcssocket.setip(this.conf.CMD_SOCKET_ID,this.conf.CMD_SOCKET_IP,this.conf.CMD_SOCKET_PORT);
		this.tcssocket.connect();
	}


	tcsapp.paging = function(n){
	//log(":::::::::::::::::::::"+$$(pages[0]));
		for(i in this.pages){
			var page = this.pages[i];
			if(i == n){
				page.ready();
				page.show();
				page.start();
			}else{
				page.stop();
				page.hide();
				page.clear();
			}
		}

		this.previouspage = this.currentpage;
		this.currentpage = n;
	}


	/*
			document.body.addEventListener('touchmove',function(e)
			{
				e = e || window.event;
				var target = e.target || e.srcElement;
				//in case $altNav is a class:
				if (!target.className.match(/\bscrollable\b/))
				{
						e.returnValue = false;
						e.cancelBubble = true;
						if (e.preventDefault)
						{
								e.preventDefault();
								e.stopPropagation();
						}
						return false;//or return e, doesn't matter
				}
				//target is a reference to an $altNav element here, e is the event object, go mad
			},false);
	*/
