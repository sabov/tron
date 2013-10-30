var Tron = (function(){

	var tron = function(){
		var self = this;
		jQuery(document.body).find('p').css('display', 'none');
		self.offset = 0;
		self.canvas = self.createCanvas();
		self.ctx = self.canvas.getContext('2d');
		self.timeInterval = 15;
		self.keyCode = 38;//arrow up key code
		self.line = new line(300,300, 90, self);
		self.draw();
		jQuery(window).bind('keydown', function(e){self.keyPressHandler(e);})
		jQuery(window).bind('keyup', function(e){self.keyCode = 38;});
	}
	
	tron.prototype = {
		createCanvas: function(){
			var self = this;
			var canvas        = document.createElement('canvas');
			canvas.width      = jQuery(document.body).innerWidth()-10;
			canvas.height     = jQuery(document.body).innerHeight()-10;
			var ctx           = canvas.getContext('2d');
			ctx.lineWidth     = 3;
			ctx.lineCap       = 'round';
			ctx.shadowBlur    = 7;
			ctx.shadowColor   = "#880000";
			ctx.strokeStyle   = '#dd0000';
			ctx.shadowOffsetX = -self.offset;
			jQuery(document.body).append(canvas);
			return canvas;
		},
		draw: function(){
			var self = this;
			self.intervalId = setInterval(function(){
				self.ctx.beginPath();
				self.line.move(self.keyCode);
				self.ctx.stroke();
			},self.timeInterval);
		},
		keyPressHandler: function(e){
			var self = this;
			self.keyCode = e.keyCode;
		},
		gameOver: function(){
			var self = this;
			clearInterval(self.intervalId);
			jQuery(document.body).find('canvas').remove();
			jQuery(document.body).find('p').css('display', 'block');
		}
	}
	
	var line = function(x,y,angle, tron){
		var self = this;
		self.x = x;
		self.y = y;
		self.angle = angle;
		self.tron = tron;
		self.step = 3;
		self.angleStep = 3;
		self.ctx = tron.ctx;
		self.offset = tron.offset;
	}
	line.prototype = {
		move: function(keyCode){
			var self = this;
			switch(keyCode){
					case 37:
					self.angle-=self.angleStep;
					break;
					case 39:
					self.angle+=self.angleStep;
					break;
				}
			var x = self.x+self.step*Math.sin(self.angle*Math.PI/180);
			var y = self.y-self.step*Math.cos(self.angle*Math.PI/180);
			self.checkPath(x,y);
			self.ctx.moveTo(self.x+self.offset, self.y);
			self.ctx.lineTo(x+self.offset, y);
			self.x = x;
			self.y = y;
		},
		checkPath: function(x,y){
			var self = this;
			/*var left = Math.min(x, self.x);
			var top  = Math.min(y, self.y);
			var width = Math.abs(x - self.x);
			var height = Math.abs(y - self.y)+3;*/
			var imgd = self.ctx.getImageData(x,y, 1, 1);
			var pix = imgd.data;
			if(pix[0] > 180){
				self.tron.gameOver();
			}
				
		}
	}
	jQuery(window).bind('keydown', function(e){
		if(e.keyCode == 13){
			var myTron = new tron();
		}
	})
})();
