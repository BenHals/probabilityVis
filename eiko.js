function eiko(controller, factors, iD){
	this.paused = false;
	pauseDelay = 500;
	transTime = 1000;
	pColors = controller.getColors();
	var self = this;
	factor1 = factors[0][0];
	factor2 = factors[1][0];
	self.noFactors = false;
	self.oneFactor = false;
	
	if(factor2 == '-'){
		if(factor1 == '-'){
			self.noFactors = true;
		}else{
			self.oneFactor = true;
		}
	}else{
		if(factor1 == '-'){
			self.noFactors = true;
		}
	}
	self.F2Ok = !self.oneFactor;
	var mainScreen = d3.select("#eikosogram").append("svg").style('width','100%').style('height','100%');

	wP = new WindowPos([0, parseInt(mainScreen.style('width'),10), 0,parseInt(mainScreen.style('height'),10)]);
	this.mainWp = wP;
	eKRect = [wP.fifthsW[1][0],wP.fifthsW[3][1],10,wP.fifthsH[2][1]];
	this.init = function(){
		this.aFs = this.calcSecondaryFactor(factor1,factor2, iD);
		if(!self.noFactors){
			this.drawPrimary(mainScreen, eKRect);
		}
	}
	this.drawPrimary = function(screen,rect){
		primeWP = new WindowPos(rect);
		var propToScreen = d3.scale.linear().domain([0,1]).range([rect[0],rect[1]]);
		this.yScale = d3.scale.linear().domain([0,1]).range([rect[2],rect[3]]);
		container = screen.append("svg").attr('id','mainSquare');
		this.drawPop(primeWP,container,rect, propToScreen);
		screen.append('svg').attr('id','colorHolder');
		// var cumulativeProp = 0;
		// var rectSplit = screen.selectAll('rect').data(d3.keys(this.aFs));
		// 	rectSplit.enter().append('rect')
		// 		.attr('x', function(d){
		// 			var ret = propToScreen(cumulativeProp);
		// 			cumulativeProp += self.aFs[d]['prob'];
		// 			return  ret})
		// 		.attr('width', function(d){
					
		// 			 return propToScreen(self.aFs[d]['prob'])})
		// 		.attr('y', function(d){return rect[2]})
		// 		.attr('height', function(d){return rect[3]-rect[2]})
		// 		.style('fill',function(d,i){return d3.rgb(pColors[i][0][0],pColors[i][0][1],pColors[i][0][2])});
		//this.randSquare(screen, primeWP);
	}
	this.drawPop = function(wP,screen,rect, scale){
		//Base Rectangle
		screen.append('rect').attr('x',rect[0]).attr('y',rect[2]).attr('width',rect[1]-rect[0]).attr('height',rect[3]-rect[2]).style('fill', 'grey').style('stroke','black').style('stroke-width',10).style('stroke-alignment','outer').style('fill-opacity',0.2);
		screen.append('rect').attr('x',rect[0]).attr('y',rect[2]).attr('width',rect[1]-rect[0]).attr('height',rect[3]-rect[2]).style('fill', 'lightgrey').style('fill-opacity',1);

		//Population Number
		screen.append('text').attr('id','popNum').attr('x',middle(rect[1],rect[0])).attr('y',middle(rect[3],rect[2])).attr('text-anchor','middle').attr('font-size',wP.fontSize*2)
				.style('fill','black').style('opacity',0.8)
				.text(iD.length);
		//Individuals
		screen.append('text').attr('id','individuals').attr('x',middle(rect[1],rect[0])).attr('y',middle(rect[3],rect[2])+wP.fontSize*2).attr('text-anchor','middle').attr('font-size',wP.fontSize*2)
				.style('fill','black').style('opacity',0.8)
				.text('Individuals');

		setTimeout(function(){self.shiftDown(wP,screen,rect, scale)}, pauseDelay);
	}
	this.shiftDown = function(wP,screen,rect, scale){
		var popNum = d3.select('#popNum');
		var individuals = d3.select('#individuals');
		var pfTitle = screen.append('text').attr('id','pFTitle').attr('x',middle(rect[1],rect[0])).attr('y',self.mainWp.fifthsH[3][0]+wP.fontSize*2).attr('text-anchor','middle').attr('font-size',wP.fontSize*2)
				.style('fill','black').style('opacity',0)
				.text(factor1);
		var t0 = screen.transition().delay(pauseDelay).duration(transTime);
		t0.select('#popNum').attr('y',wP.fifthsH[3][1]);
		t0.select('#individuals').attr('y',wP.fifthsH[3][1]+wP.fontSize*2).each('end',function(){
			//self.animateSplit(wP,screen,rect, scale);
			self.stopPoint(wP,screen,rect, scale, self.fadeName);
		});;

	}
	this.fadeName = function(wP,screen,rect, scale){
		var t1 = screen.transition().duration(transTime);
		t1.select('#pFTitle').style('opacity',1).each('end',function(){
			//self.animateSplit(wP,screen,rect, scale);
			self.animateSplit(wP,screen,rect, scale, self.animateSplit);
		});;

	}
	this.animateSplit = function(wP,screen,rect, scale){
		//create containers for each column
		self.pFCols = screen.selectAll('g').data(d3.keys(self.aFs)).enter().append('g').attr('class','pFCols');
		var text = self.pFCols.append('text').attr('class','pgCount').attr('x',middle(rect[1],rect[0])).attr('y',wP.fifthsH[3][1]).attr('text-anchor','middle').attr('font-size',wP.fontSize)
			.style('fill','black').style('opacity',0)
			.text(function(d){return self.aFs[d]['num']});
		var cumulativeProp = 0;
		var names = self.pFCols.append('text').attr('class','pgName').attr('y',wP.fifthsH[1][1]+wP.fontSize).attr('x',function(d){
				cumulativeProp += self.aFs[d]['prob']; 
				return scale(cumulativeProp - self.aFs[d]['prob']/2)}).attr('text-anchor','middle').attr('font-size',function(d){return wP.fontSize})
			.style('fill','black').style('opacity',0)
			.text(function(d){return d});
		cumulativeProp = 0;
		var count = d3.keys(self.aFs).length;
		text.transition().delay(function(d,i){
			return 0;
			var retVal = i*(transTime+(pauseDelay/5));
			return retVal;}).duration(transTime)
			.attr('y',wP.fifthsH[1][1]).attr('x',function(d,i){
				cumulativeProp += self.aFs[d]['prob']; 
				return scale(cumulativeProp - self.aFs[d]['prob']/2)})
			.style('opacity',1).style('fill','black').style('stroke','black').style('stroke-width',0);
		names.transition().delay(function(d,i){
			return transTime*0.8;
			var retVal = (i+1)*(transTime)+(i*(pauseDelay/5));
			return retVal;}).duration(100)
			.style('opacity',1).transition().duration(pauseDelay)
			.each('end', function(d,i){count--;if(count==0){self.fadeGN(wP,screen,rect, scale)}});
	}
	this.fadeGN = function(wP,screen,rect, scale){
		var popNum = d3.select('#popNum');
		var individuals = d3.select('#individuals');
		self.pFCols = d3.selectAll('.pFCols');
		var cumulativeProp = 0;
		var count = d3.keys(self.aFs).length;
		// var text = self.pFCols.append('text').attr('class','pgName').attr('y',wP.fifthsH[1][1]+wP.fontSize).attr('x',function(d){
		// 		cumulativeProp += self.aFs[d]['prob']; 
		// 		return scale(cumulativeProp - self.aFs[d]['prob']/2)}).attr('text-anchor','middle').attr('font-size',wP.fontSize)
		// 	.style('fill','grey').style('opacity',0)
		// 	.text(function(d){return d});
		var text = d3.selectAll('.pgName')
		individuals.transition().duration(transTime).style('opacity',0).each('end',function(){d3.select(this).remove()});
		popNum.transition().duration(transTime).style('opacity',0).each('end', function(d,i){
				//count--;
				//if(count == 0){
					self.nameDrop(wP,screen,rect, scale);
				//};
			});
		// text.transition().duration(transTime).style('opacity',1).style('fill','white').style('stroke','black')
		// 	.each('end', function(d,i){
		// 		count--;
		// 		if(count == 0){
		// 			self.nameDrop(wP,screen,rect, scale);
		// 		}
		// 	})

	}
	this.nameDrop = function(wP,screen,rect, scale){
		var count = d3.keys(self.aFs).length;
		d3.select('#pFTitle').transition().duration(transTime).attr('y',self.mainWp.fifthsH[4][0])
		d3.selectAll('.pgName').transition().duration(transTime)
			.attr('y', function(d,i){return wP.fifthsH[4][1]+wP.fontSize*1 + 5*((i%2))})
			.each('end',function(){
				count--;
				if(count==0){
					self.drawCols(wP,screen,rect, scale);
				}
			});

	}
	this.drawCols = function(wP,screen,rect, scale){
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//left edge
		self.pFCols.append('g').attr('id','colRectHolder');
		self.pFCols.append('line').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			var retVal = cProbX2;
			cProbX2 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[4][1]).attr('class',function(d){
			var fTest = cProbIsOuter;
			cProbIsOuter += self.aFs[d]['prob'];
			var eTest = cProbIsOuter;
			if(fTest == 0){
				return 'outerBound';
			}else{
				return 'innerBound';
			}
		}).style('stroke-width', 3).style('stroke','black').style('opacity',0);
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//right edge
		self.pFCols.append('line').attr('x1', function(d){
			
			cProbX1 += self.aFs[d]['prob'];
			var retVal = cProbX1;
			return scale(retVal);
		}).attr('x2', function(d){
			
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[4][1]).attr('class',function(d){
			var fTest = cProbIsOuter;
			cProbIsOuter += self.aFs[d]['prob'];
			var eTest = cProbIsOuter;
			if(eTest == 1){
				return 'outerBound';
			}else{
				return 'innerBound';
			}
		}).style('stroke-width', 3).style('stroke','black').style('opacity',0);
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//top
		self.pFCols.append('line').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[0][0]).attr('y2',wP.fifthsH[0][0]).attr('class','outerBound')
		.style('width', 3).style('stroke','black').style('opacity',0);
		var cProbX1 = 0;
		var cProbX2 = 0;
		var cProbIsOuter = 0;
		//bottom
		self.pFCols.append('line').attr('id','bLine').attr('x1', function(d){
			var retVal = cProbX1;
			cProbX1 += self.aFs[d]['prob'];
			return scale(retVal);
		}).attr('x2', function(d){
			cProbX2 += self.aFs[d]['prob'];
			var retVal = cProbX2;
			return scale(retVal);
		}).attr('y1',wP.fifthsH[4][1]).attr('y2',wP.fifthsH[4][1]).attr('class','outerBound')
		.style('width', 3).style('stroke','black').style('opacity',0);

		var innerCols = d3.selectAll('.innerBound')
		var count = innerCols.length;
		innerCols.attr('y2', function(d){return d3.select(this).attr('y1')}).style('opacity',1)
			.transition().duration(transTime)
			.attr('y2',wP.fifthsH[4][1])
			.transition().duration(pauseDelay)
			.each('end',function(){
				count--;
				oneFactor = false;
					if(factor2 == '-'){
							oneFactor = true;
						}
				if(count==0){

					//self.splitCol(d3.select('.pFCols'),0, wP,screen,rect, scale)
					self.stopPoint(wP,screen,rect, scale,self.secondaryTitle);
				}
			});

	}
	this.secondaryTitle = function(wP,screen,rect, scale){
		var sfTitle = screen.append('text').attr('id','sFTitle').attr('y',middle(rect[3],rect[2])).attr('x',self.mainWp.fifthsW[4][1]).attr('text-anchor','end').attr('font-size',fontS(wP.fontSize*2,self.mainWp.oneFifthW*2,factor2))
		.style('fill','black').style('opacity',0)
		.text(factor2);
		sfTitle.transition().duration(transTime).style('opacity',1).each('end',function(){self.nameSecondary(wP,screen,rect, scale);});

	}
	this.secondSplit = function(wP,screen,rect, scale){
		var count = self.pFCols[0].length;
		self.pFCols[0].reverse();
		self.pFCols.each(function(d,i){
			count--;
			var isLast = (count==0);
			var thisCol = d3.select(this);
			setTimeout(function(){self.splitCol(thisCol,i,wP,screen,rect, scale, isLast)},i*(transTime+pauseDelay));
		})
	}
	this.nameSecondary = function(wP,screen,rect, scale){
		var secondaryCounts = self.aFs[d3.keys(self.aFs)[d3.keys(self.aFs).length-1]]['secondary'][1];
		var secNames = d3.keys(secondaryCounts);
		var prevY = 0;
		for(var i = 0; i<secNames.length-1;i++){
			var yValue = self.yScale(middle(prevY, prevY+secondaryCounts[secNames[i]]));
			prevY += secondaryCounts[secNames[i]];
			screen.append('text').attr('class','sfNames').attr('x',self.mainWp.fifthsW[4][0]+10).attr('y',yValue).attr('text-anchor','left').attr('font-size',Math.min(wP.fontSize, (self.mainWp.oneFifthW/2)/secNames[i].length))
			.style('fill','black').style('opacity',0)
			.text(secNames[i]);
		}
		var count = secNames.length-1;
		d3.selectAll('.sfNames').transition().duration(transTime).style('opacity',1).transition().duration(pauseDelay).each('end', function(){
			count--;
			if(count==0){
				self.secondSplit(wP,screen,rect, scale);
			}
		});
		
	}
	this.splitCol = function(col,colI, wP,screen,rect, scale, isLast){

		var secondaryCounts = self.aFs[col.data()]['secondary'][0];
		var secondaryProbs = self.aFs[col.data()]['secondary'][1];
		var cProb = 0;
		var cProbY = 0;
		var yValues = [];
		for(var j =0;j<d3.keys(secondaryCounts).length-1;j++){
			col.select('#colRectHolder').append('rect').attr('class','secondRect').attr('x', col.select('#bLine').attr('x1')).attr('height',function(d){
				var name = d3.keys(secondaryCounts)[j];
				var prob = secondaryProbs[name];
				var retPos = self.yScale(prob)-self.yScale(0);
				return retPos;
			}).attr('y',function(d){
				var retValue = cProbY;
				var name = d3.keys(secondaryCounts)[j];
				var prob = secondaryProbs[name];
				cProbY += prob;
				return self.yScale(retValue);
			}).attr('width',col.select('#bLine').attr('x2') - col.select('#bLine').attr('x1'))
			.style('fill', function(){
				var retVal = d3.rgb(pColors[j][0][0], pColors[j][0][1],pColors[j][0][2]);
				return retVal;}).style('opacity',0);
			col.append('text').attr('id',colI+'-'+j+'text').attr('data-name',d3.keys(secondaryCounts)[j]).attr('class', 'secondaryCounts').attr('y',wP.fifthsH[1][1]).attr('x',col.select('.pgCount').attr('x')).attr('text-anchor','middle').attr('font-size',wP.fontSize)
			.style('fill','black').style('stroke','black').style('opacity',1).style('stroke-width',0)
			.text(secondaryCounts[d3.keys(secondaryCounts)[j]]);


		}
		cProb = 0;
		col.selectAll('.secondRect').transition().duration(transTime)
			.style('opacity',0.8);
		col.selectAll('.secondaryCounts').transition().duration(transTime)
			.attr('y', function(d){
				// var name = d3.select(this).attr('data-name');
				// var prob = secondaryProbs[name];
				// var yPos = middle(cProb, cProb+prob);
				// cProb += prob;
				// var retPos = self.yScale(yPos)
				// return retPos;
				var retValue = cProb;
				var name = d3.select(this).attr('data-name');
				var prob = secondaryProbs[name];
				cProb += prob;
				var ret = self.yScale(middle(retValue,cProb))+wP.fontSize/2;
				yValues.push(ret);
				return ret;
			})
		col.select('.pgCount').transition().duration(transTime).style('opacity',0).each('end',function(){
			d3.select(this).remove()
			if(isLast){
				//self.nameSecondary(wP,screen,rect, scale, yValues);
			}});
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
	this.destroy = function(callback){
		d3.select("#eikosogram").selectAll("*").transition().duration(0).attr('x',0).each('end', function(){d3.select(this).remove();});
		callback();
	}
	this.stopPoint = function(wP,screen,rect, scale,resume){
		self.wP = wP;
		self.screen = screen;
		self.rect = rect;
		self.scale = scale;
		self.resume = resume;
		self.paused = true;
		if(resume == self.secondaryTitle){
			self.F2Ok = true;
		}
		controller.canContinue();
	}
	this.continue = function(){
		if(self.paused && (!self.F2Ok | !self.oneFactor)){
			controller.cantContinue();
			self.paused = false;
			self.resume(self.wP,self.screen,self.rect,self.scale);
		}
	}
	this.continueF2 = function(nfactors){
		self.paused = false;
		controller.cantContinue();
		self.F2Ok = false;
		factor2 = nfactors[0];
		self.aFs = this.calcSecondaryFactor(factor1,factor2, iD);
		self.secondaryTitle(self.wP,self.screen,self.rect, self.scale);
	}
	this.init();
}

function WindowPos(rect){
	//this.width = parseInt(mainEl.style('width'),10);
	//this.height = parseInt(mainEl.style('height'),10);
	this.width = rect[1]-rect[0];
	this.height = rect[3]-rect[2];
	this.fontSize = Math.min(this.width,this.height)/15;
	this.fifthsW = [];
	this.oneFifthW = this.width/5;
	this.fifthsH = [];
	this.oneFifthH = this.height/5;
	for(var i =1; i<=5;i++){
		this.fifthsW.push([this.oneFifthW*(i-1)+rect[0], this.oneFifthW*(i)+rect[0]]);
	}
	for(var i =1; i<=5;i++){
		this.fifthsH.push([this.oneFifthH*(i-1)+rect[2], this.oneFifthH*(i)+rect[2]]);
	}
}
function randRGB(){
	return [Math.random()*255,Math.random()*255,Math.random()*255];
}
function middle(A,B){
	return (A+B)/2;
}
function fontS(A, B, text){
	return Math.min(A, (B)/(text.length*2.5));
}