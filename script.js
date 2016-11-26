window.onload = function() {
	// buttons.onmouseover = function(evt) {
	// 	var target = evt.target
	// 	if (target.tagName !== 'INPUT') return;

	// 	target.classList.add('mouse-over-button');
	// }

	// buttons.onmouseout = function(evt) {
	// 	var target = evt.target
	// 	if (target.tagName !== 'INPUT') return;

	// 	target.classList.remove('mouse-over-button');
	// }

	var calc = {
		"+": function(a, b) { return a + b; },
		"-": function(a, b) { return a - b; },
		"*": function(a, b) { return a * b; },
		"/": function(a, b) { return a / b; },
		flag: false,
		expValue: 0,
		expValueBeforeSqrt: 0,
		expOperationBeforeSqrt: "",
		expOperation: "",
		numberClick: function(n, bottom) {
			if (this.expOperation == "sqrt") {
				clearCalc();
				this.numberClick(n, bottom);
				return;
			}

			if (bottom.value === "0" || this.flag) {
				bottom.value = n;
				this.flag = false;
				return;
			}
			bottom.value += n;
		},
		operationClick: function(operation, exp, bottom) {
			if (this.expOperation == "sqrt") {
				exp.value += operation;
				this.flag = true;
				this.expValue = this.equalClick();
				this.expOperation = operation;
				bottom.value = this.expValue;
				return;
			}

			if (this.expOperation != "" && this.flag == true) {
				exp.value = exp.value.replace(/.$/, operation);
				this.expOperation = operation;
				return;
			}

			exp.value += parseFloat(bottom.value) + operation;

			if (this.expOperation == "") {
				this.expValue = +bottom.value;
			}
			else {
				this.expValue = this.equalClick();
				bottom.value = this.expValue;
			}

			this.flag = true;
			this.expOperation = operation;
		},
		sqrtClick: function(exp, bottom) {
			var oldBottomValue = +bottom.value;
			bottom.value = Math.sqrt(+bottom.value);

			if (this.expOperation == "sqrt") {
				putOneSqrtInAnother();
				this.expValue = bottom.value;
				return;
			}

			if (this.expOperation == "") {
				this.expValue = bottom.value;
			}
			else {
				this.expValueBeforeSqrt = this.expValue;
				this.expOperationBeforeSqrt = this.expOperation;
				this.expValue = this.equalClick();
			}

			this.flag = true;
			exp.value += "sqrt(" + oldBottomValue + ")";
			this.expOperation = "sqrt";
		},
		equalClick: function() {
			if (this.expOperation == "sqrt") {

				if (this.expOperationBeforeSqrt != "") {
					var value = this[this.expOperationBeforeSqrt](+this.expValueBeforeSqrt, +bottom.value);
					calc.expValueBeforeSqrt = 0;
					calc.expOperationBeforeSqrt = "";
					return value;
				}
				else {
					return this.expValue;
				} 
			}
			else {
				return this[this.expOperation](+this.expValue, +bottom.value);
			}
		}
	}

	buttons.onclick = function(evt) {
		var target = evt.target
		if (target.tagName !== 'INPUT') return;

		var n = parseFloat(target.value);

		if (target.value == "\u221a") {
			calc.sqrtClick(exp, bottom);
			return;
		}

		if (!isNaN(n)) {
			calc.numberClick(n, bottom);
			return;
		}

		if (target.value == "+" || target.value == "-" || target.value == "*" || target.value == "/") {
			calc.operationClick(target.value, exp, bottom);
			return;
		}

		if (target.value == '=') {
			if (calc.expOperation == "") return;
			bottom.value = calc.equalClick();
			exp.value = "";
			calc.flag = true;
			calc.expValue = 0;
			calc.expValueBeforeSqrt = 0;
			calc.expOperationBeforeSqrt = "";
			calc.expOperation = "";
			return;
		}

		if (target.value == "C") {
			clearCalc();
			return;
		}

		if (target.value == ",") {
			if (calc.flag) {
				if (calc.expOperation == "sqrt") clearCalc();
				bottom.value = "0.";
				calc.flag = false;
			}
			else if (bottom.value.lastIndexOf(".") === -1) {
				bottom.value += "."
			}
 		}
	}

	function clearCalc() {
		exp.value = "";
		bottom.value = 0;
		calc.flag = false;
		calc.expValue = 0;
		calc.expValueBeforeSqrt = 0;
		calc.expOperationBeforeSqrt = "";
		calc.expOperation = "";
	}

	function putOneSqrtInAnother() {
		var lastOperationIndex = null;

		["+", "-", "*", "/"].every(function(element) { 
			var index = exp.value.lastIndexOf(element)

			if (index != -1)  {
				lastOperationIndex = index;
				return;
			}
		});

		if (lastOperationIndex != null) {
			exp.value = [exp.value.slice(0, lastOperationIndex + 1), "sqrt(", exp.value.slice(lastOperationIndex + 1), ")"].join('');
		}
		else {
			exp.value = ["sqrt(", exp.value, ")"].join('');
		}
	}
}
