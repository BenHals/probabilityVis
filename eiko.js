function eiko(controller, factors, iD){
	pColors = controller.getColors();
	var self = this;
	factor1 = factors[0][0];
	factor2 = factors[1][0];
	var mainScreen = d3.select("#eikosogram").append("svg").style('width','100%').style('height','100%');

	wP = new WindowPos([0, parseInt(mainScreen.style('width'),10), parseInt(mainScreen.style('height'),10),0]);
	eKRect = [0, wP.fifthsW[2][1],0,wP.fifthsH[2][1]];
	this.init = function(){
		this.aFs = this.calcSecondaryFactor(factor1,factor2, iD);
		this.drawPrimary(mainScreen, eKRect);
	}
	this.drawPrimary = function(screen,rect){
		primeWP = new WindowPos(rect);
		var propToScreen = d3.scale.linear().domain([0,1]).range([0,rect[1]]);
		container = screen.append("svg").attr('id','mainSquare');
		var cumulativeProp = 0;
		var rectSplit = screen.selectAll('rect').data(d3.keys(this.aFs));
			rectSplit.enter().append('rect')
				.attr('x', function(d){
					var ret = propToScreen(cumulativeProp);
					cumulativeProp += self.aFs[d]['prob'];
					return  ret})
				.attr('width', function(d){
					
					 return propToScreen(self.aFs[d]['prob'])})
				.attr('y', function(d){return rect[2]})
				.attr('height', function(d){return rect[3]-rect[2]})
				.style('fill',function(d,i){return d3.rgb(pColors[i][0][0],pColors[i][0][1],pColors[i][0][2])});
		//this.randSquare(screen, primeWP);
	}
	this.calcPrimaryFactor = function(factor, iL){
		fTotals = new Object();
		totalNum = 0;
		for (index in iL){
			var o = iL[index];
			val = o[factor];
			if(val in fTotals){
				fTotals[val] += 1;
			}else{
				fTotals[val] = 1;
			}
			totalNum++;
		}
		fTotals['total'] = totalNum;
		fProbs = new Object();
		for (v in fTotals){
			fProbs[v] = fTotals[v]/totalNum;
		}
		return [fTotals,fProbs];
	}
	this.calcSecondaryFactor = function(pF,sF, iL){
		AllProbs = new Object();
		primeSplit = new Object();
		for (index in iD){
			var o = iD[index];
			val = o[pF];
			if(!(val in primeSplit)){
				primeSplit[val] = [] ;
			}
			primeSplit[val].push(o);
		}
		sFProbs = new Object();
		//AllProbs['total'] = iL.length;
		for (p in primeSplit){
			AllProbs[p] = new Object();
			AllProbs[p]['num'] = primeSplit[p].length;
			AllProbs[p]['prob'] = AllProbs[p]['num']/iL.length;
			AllProbs[p]['secondary'] = this.calcPrimaryFactor(sF, primeSplit[p]);
		}
		return AllProbs;
	}
	this.randSquare = function(screen, wP){
		for(var r = 0; r<5;r++){
			for(var c = 0;c<5;c++){
				screen.append("rect").attr('x',wP.fifthsW[c][0]).attr('y', wP.fifthsH[r][0]).attr('width',wP.oneFifthW).attr('height',wP.oneFifthH).style('fill',function() {
   				return "hsl(" + Math.random() * 360 + ",100%,50%)";
    			});
			}
		}
	}
	this.destroy = function(){
		mainScreen.remove();
	}
	this.init();
}

function WindowPos(rect){
	//this.width = parseInt(mainEl.style('width'),10);
	//this.height = parseInt(mainEl.style('height'),10);
	this.width = rect[1]-rect[0];
	this.height = rect[2]-rect[3];
	this.fifthsW = [];
	this.oneFifthW = this.width/5;
	this.fifthsH = [];
	this.oneFifthH = this.height/5;
	for(var i =1; i<=5;i++){
		this.fifthsW.push([this.oneFifthW*(i-1), this.oneFifthW*(i)]);
	}
	for(var i =1; i<=5;i++){
		this.fifthsH.push([this.oneFifthH*(i-1), this.oneFifthH*(i)]);
	}
}
function randRGB(){
	return [Math.random()*255,Math.random()*255,Math.random()*255];
}