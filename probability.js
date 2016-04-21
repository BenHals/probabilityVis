function probability(){
	pColors = [];
	for(var c =0;c<20;c++){
		pColors.push([randRGB(),0.8]);
	}
	var self = this;
	this.view = new probView(this)
	this.view.init()
	this.model = new probModel(this)
	this.getColors = function(){
		return pColors;
	}
	this.impButPressed = function(e){
		this.model.getFile(e);
	}
	this.finishedModelSU = function(){
		this.view.suManipTools(this.model.getCategorical(), self.finToolSU);
	}
	this.createDisplay = function(){
		factors = self.getFactors();
		self.dataDisplay = new eiko(self,[self.model.getHeading(factors[0]),self.model.getHeading(factors[1])], self.model.getData());
	}
	this.finToolSU = function(){
		self.createDisplay();
	}
	this.getFactors = function(){
		return this.view.getFactors();
	}
	this.primeSelected = function(){
		this.destroyScreen(self.createDisplay);
	}
	this.destroyScreen = function(callback){
		this.dataDisplay.destroy(function(){
			this.dataDisplay = null;
			callback();
		});

	}
}
var mainControl = null;
window.onload = function(){
	mainControl = new probability();
};