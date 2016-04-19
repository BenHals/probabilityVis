function probView(controller){
	this.init = function(){
		var IB = document.getElementById("file");
		IB.onchange = function(e){
			controller.impButPressed(e);
		}
	}
	this.getFactors = function(){
		return [$("#fac1").val(), $("#fac2").val()];
	}
	this.suManipTools = function(headings,callback){
		this.suDataUI();
		this.suIndependanceUI();
		this.suFactorSelectors(headings);
		this.suSwapFactorsUI();
		callback();
	}
	this.suDataUI = function(){
		oC = $('#showDataUI');
		oC.html(`
					<div id='showData' class='form-group'>
						<label class = 'control-label' for='showData'>Show data labels</label>
						<div class='shiny-options-group'>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='None' checked='checked'>
							<span>None</span>
							</label>
						</div>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='Counts'>
							<span>Counts</span>
							</label>
						</div>
						<div class = 'radio'>
							<label>
							<input type='radio' name='showData' value='Proportions'>
							<span>Proportions</span>
							</label>
						</div>
						</div>
					</div>
				`);
	}
	this.suIndependanceUI = function(){
		oC = $('#independenceUI');
		oC.html(`<div class="form-group">
					<div class="checkbox">
						<label>
							<input id="independence" type="checkbox">
							<span>Show independence</span>
						</label>
					</div>
				</div>`);
	}
	this.suFactorSelectors = function(headings){
		oC = $("#factorSelectors");
		for(var j =1;j<=2;j++){
			container = $("<div>").attr('class', 'form-group').appendTo(oC);
			container.append($("<label>").text("Factor "+j));
			dC = $("<div>").appendTo(container);
			var s = $("<select>").attr("id","fac"+j).appendTo(dC);
			$.each(headings, function(i, val){
				var o = $("<option>").attr('value', i).text(val[0]).appendTo(s);
				if(i+1 == j){
					o.attr('selected',true);
				}
			})
		}
		var SM = document.getElementById("fac1");
		SM.onchange = function(){
			controller.primeSelected();
		}
		var SM2 = document.getElementById("fac2");
		SM2.onchange = function(){
			controller.primeSelected();
		}
	}
	this.suSwapFactorsUI = function(){
		oC = $("#swapFactorsUI");
		var button = $("<button>").attr('id','swapFactors').attr('type','button').attr('class','btn btn-default action-button').text("Swap factors").appendTo(oC);
		button.click(function(){
			var f1 = $('#fac1').val();
			var f2 = $('#fac2').val();
			$('#fac1').val(f2);
			$('#fac2').val(f1);
			controller.primeSelected();
		})

	}
}