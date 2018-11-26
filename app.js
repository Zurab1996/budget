var budgetController = (function(){
	var Expense = function(id, description, value, percentage){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = percentage;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals:{
			exp: 0,
			inc: 0
		},
		percentage:0,
		budget:0
	};

	var addItem = function(type, desc, val){
		var newItem, id, expPersentage;

		//generate new id for new item
		if(data.allItems[type].length===0){
			id = 0;
		}else{
			id = data.allItems[type][data.allItems[type].length-1].id + 1; 
		}


		if(data.totals.inc > 0){
			expPersentage = Math.round((val/data.budget)*100);
		}else{
			expPersentage = -1;
		}

		//create new item object
		if(type==='exp'){
			newItem = new Expense(id, desc, val, expPersentage);
		} else if(type==='inc'){
			newItem = new Income(id, desc, val);
		}

		//push new item in data object
		data.allItems[type].push(newItem);

		return newItem;
	};

	var calculateTotal = function(type){
		var sum=0;
		data.allItems[type].forEach(function(item){
			sum+=item.value
		});

		data.totals[type] = sum;
	};

	var calculateBudget = function(){

		calculateTotal('exp');
		calculateTotal('inc');

		data.budget = data.totals.inc - data.totals.exp;

		if(data.totals.inc > 0){
			data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
		}else{
			data.percentage = -1;
		}
	};

	var budget = function(){
		return {
			budget: data.budget,
			totalInc: data.totals.inc,
			totalExp: data.totals.exp,
			percentage: data.percentage
		}
	};

	var deleteItem = function(type, id){
		for( var i = 0; i < data.allItems[type].length; i++){ 
		    if ( data.allItems[type][i].id === parseInt(id)) {
		     	data.allItems[type].splice(i, 1); 
		    }
		}
	}

	return {
		getAddItem: addItem,
		getCalculateBudget: calculateBudget,
		getBudget: budget,
		getDeleteItem: deleteItem,
		test: data
	};

	
})();

var UIController = (function(){

	//set dom classes
	var DOMstrings = {
		addType:'.add__type',
		addDescription: '.add__description',
		addValue: '.add__value',
		addButton: '.add__btn',
		incomeList: '.income__list',
		expensesList: '.expenses__list',
		budgetValue: '.budget__value',
		budgetInc:'.budget__income--value',
		budgetExp: '.budget__expenses--value',
		budgetExpPercentage:'.budget__expenses--percentage',
		container:'.container',
		item:'.item',
		budgetTitle:'.budget__title--month',
	};

	//get input values
	var inputValues = function(){
		return {
			type: document.querySelector(DOMstrings.addType).value,
			description: document.querySelector(DOMstrings.addDescription).value,
			value: parseFloat(document.querySelector(DOMstrings.addValue).value),
		}
	};

	//add new item in list
	var addListItem = function(object, type){
		var html, newHtml, containerDOM;

		if(type==='exp'){
			containerDOM = DOMstrings.expensesList;
			html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		} else if(type==='inc'){
			containerDOM = DOMstrings.incomeList;
			html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}

		newHtml = html.replace('%id%', object.id);
		newHtml = newHtml.replace('%description%', object.description);
		newHtml = newHtml.replace('%value%', formatBudget(object.value, type));
		newHtml = newHtml.replace('%percentage%', object.percentage);

		document.querySelector(containerDOM).insertAdjacentHTML('beforeend', newHtml);
	};

	//cleare inputs
	var clearFields = function(){
		var fields, fieldsArray;
		
		fields = document.querySelectorAll(DOMstrings.addDescription+', '+DOMstrings.addValue);
		fieldsArray = Array.prototype.slice.call(fields)

		fieldsArray.forEach(function(current) {
			current.value=""
		})

		fieldsArray[0].focus();
	};

	//show inc exp in budget
	var budget = function(object){
		document.querySelector(DOMstrings.budgetValue).textContent = formatBudget(object.budget, object.type);
		document.querySelector(DOMstrings.budgetInc).textContent = formatBudget(object.totalInc, object.type);
		document.querySelector(DOMstrings.budgetExp).textContent = formatBudget(object.totalExp, object.type);
		if(object.percentage>0){
			document.querySelector(DOMstrings.budgetExpPercentage).textContent = object.percentage+'%';
		}else{
			document.querySelector(DOMstrings.budgetExpPercentage).textContent = '----';
		}
	}

	//set current year and month
	var displayCurrentDate = function(){
		var date, monthArray;
		date = new Date();
		monthArray = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September','October', 'November', 'December'];

		document.querySelector(DOMstrings.budgetTitle).textContent = monthArray[date.getMonth()]+' of '+date.getFullYear();
	}

	//numer formate
	var formatBudget = function(number, type){
		console.log(type)
		if (type == 'exp') {
			return '-'+(number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
		} else {
			return '+'+(number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
		}
	}

	//delete item from array list
	var deleteItem = function(node){
		node.remove();
	}

	//make public importent methods or values
	return {
		getDOMstrings: DOMstrings,
		getInput: inputValues,
		getAddListItem: addListItem,
		getClearFields: clearFields,
		getBudget: budget,
		getDeleteItem: deleteItem,
		getFormatBudget: formatBudget,
		getDisplayCurrentDate: displayCurrentDate,
	};

})();

var controller = (function(budgetCtrl, UICtrl){

	//set up event listeners(project init function)
	var setUpEventListeners = function(){
		//get dom strings
		var DOM = UICtrl.getDOMstrings;
		
		UICtrl.getBudget({
			budget: 0,
			totalInc: 0,
			totalExp: 0,
			percentage: '----'
		});

		UICtrl.getDisplayCurrentDate();

		//listen click event
		document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

		//listen enter event
		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});

		//listed delete click 
		document.querySelector(DOM.container).addEventListener('click', function(event){
			ctrlDeleteItem(event, DOM)
		});
	};

	var updateBudget = function(){
		budgetCtrl.getCalculateBudget();
		var budget = budgetCtrl.getBudget();
		UICtrl.getBudget(budget);
	};

	//get input values
	var ctrlAddItem = function(){
		var inputData, newItem;

		//get field values
		inputData = UICtrl.getInput();

		if(inputData.description!=="" && !isNaN(inputData.value) && inputData.value>0){
			//add new item to budget data
			newItem = budgetController.getAddItem(inputData.type, inputData.description, inputData.value);

			//add new item in dom
			UICtrl.getAddListItem(newItem, inputData.type);

			//cleare fields
			UICtrl.getClearFields();

			//update budget
			updateBudget();
		}
	};

	//delete item
	var ctrlDeleteItem = function(event, DOM){
		var currentNode = helper.getClosest(event.target, DOM.item);
		var itemInfo = currentNode.id.split('-');

		//remove item data from budgetData
		budgetCtrl.getDeleteItem(itemInfo[0], itemInfo[1]);
		//remove item from dom
		UIController.getDeleteItem(currentNode);
		//reset budget
		updateBudget()
	}

	//make public importent methods or values
	return {
		init: setUpEventListeners
	};

})(budgetController, UIController);

var helper = (function(){
	var closest = function(DOM, className){
		var className = className.charAt(0) === '.' ? className.substr(1) : className;
		var searchableRootDom = DOM.parentNode;

		if(searchableRootDom.classList.contains(className)){

			return searchableRootDom;

		} else if(searchableRootDom.nodeName == 'HTML'){

			return 'undefined';

		} else{

			return closest(searchableRootDom, className);

		}
	}

	return {
		getClosest: closest
	}
})();

// console.log(helper.getClosest(document.querySelector('.add__btn'),  'add'))

controller.init()