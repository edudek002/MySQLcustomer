var inquirer =require("inquirer");
var mysql =require("mysql");

var items_left;
var new_stock;



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});



function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "WHAT WOULD YOU LIKE TO DO?",
      choices: [
        "View products for sale",
        "View low inventory",
        "Add to inventory",
        "Add new product",
        "Oops! delete last product",
        "Exit"
      ]
    })
    .then(function(answer) {
      	switch (answer.action) {
	        case "View products for sale":
	          viewProductsForSale();
	          break;

	        case "View low inventory":
	          viewLowInventory();
	          break;

	        case "Add to inventory":
	          addToInventory();
	          break;

	        case "Add new product":
	          addNewProduct();
	          break;

	        case "Oops! delete last product":
	          deleteProduct();
	          break;

	        case "Exit":
	          exit();
	          break;
      	}
    });
}

//view all products for sale
function viewProductsForSale() {
  console.log("-----------------------------------");
  console.log("ALL AVAILABLE ITEMS");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log();
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("End of products.")
    console.log("-----------------------------------\n");
  	runSearch();
  });
}


//view low inventry function
function viewLowInventory() {
	console.log("-----------------------------------");
	var lowItem=0;
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
    for (var i = 0; i <res.length; i++) {
      	console.log("LOW INVENTORY ITEMS");
      	if (lowItem>=res[i].stock_quantity){
    		console.log("There are no itmes with low inventory.")
    	}
    	else {
      		console.log();
      		console.log("Item # " + res[i].item_id + " : " + "'" + res[i].product_name + "'" + " has low inventory of " + res[i].stock_quantity);
    	}
    }
    
    console.log("-----------------------------------\n");
  	runSearch();
  });
}


//add more items to inventory
function addToInventory () {
	inquirer
	    .prompt([
	      {
	        name: "ID",
	        type: "input",
	        message: "What is the ID number of the item you would like to add?\n"
	      },
	      {
	        name: "addNumber",
	        type: "input",
	        message: "How many items would you like to add?"
	      }
	    ])
	    .then(function(answer) {

	    	var query = "SELECT item_ID, stock_quantity FROM products WHERE ?";
            connection.query(query, 
		        { 
		      	  item_ID: answer.ID 
		        }, 
		        function(err, res) {

		            for (var i = 0; i < res.length; i++) {
            		items_left=res[i].stock_quantity;
            		var ID = res[i].item_ID;
            		console.log("-----------------------------------");
            		console.log("INFO FOR MANAGER:");
            		console.log("Before transaction we had " + items_left + " items left with ID = " + res[i].item_ID);
		            }	
			    	new_stock = items_left + parseInt(answer.addNumber);
		            console.log("After transaction we have " + new_stock + " items with ID = " + ID);
			    	var query = "UPDATE products SET ? WHERE ?";
			    	console.log("");
			        connection.query(query, 
					    [
			               {
			                   stock_quantity: new_stock 
			               },
			               {
			                   item_ID: answer.ID
			               }
			            ],

				        function(err, res) {
				          
				            console.log("Your inventory was updated!");
				            console.log("-----------------------------------");
			        	}
			        );
			    runSearch();
				}
			);
	    });
}

//add new product to inventory function
function addNewProduct () {
	inquirer
	    .prompt([
	      {
	        name: "product",
	        type: "input",
	        message: "What is the name of the item you would like to add?\n"
	      },
	      {
	        name: "department",
	        type: "input",
	        message: "What is the department name of the item you would like to add?\n"
	      },
	      {
	        name: "price",
	        type: "input",
	        message: "What is the price of the item you would like to add?\n"
	      },
	      {
	        name: "quantity",
	        type: "input",
	        message: "How many items would you like to add?\n"
	      }
	    ])
	    .then(function(answer) {

	    	var query = "INSERT INTO products SET ?, ?, ?, ?";
            connection.query(query,
            	[
		        { 
		      	  product_name: answer.product 
		        },
		        { 
		      	  department_name: answer.department 
		        },
		        { 
		      	  price: answer.price 
		        },
		        { 
		      	  stock_quantity: answer.quantity 
		        }
		        ],
		        
		        function(err, res) {
		        	res.lenght=res.length+1;
		            for (var i = 0; i < res.length; i++) {
            		//items_left=res[i].stock_quantity;
            		//var ID = res[i].item_ID;
            		console.log("HI");
      				//console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            		
		            }
		        console.log("You added a new item!");
		        console.log("-----------------------------------\n");
				runSearch();
				}
			);
	    });
}


function deleteProduct() {
  	console.log("Deleting all items added by the manager...\n");
  	connection.query(
    	"DELETE FROM products WHERE item_ID>10",
   
    	function(err, res) {
      	console.log(res.affectedRows + " products deleted!\n");
    	console.log("-----------------------------------\n");
		runSearch();
    	
    	}
  	);
}

function exit () {
	inquirer
	    .prompt([
	      {
	        name: "question",
	        type: "input",
	        message: "Do you want to exit? Type 'y' or 'n'.\n"
	      },
	    ])
	    .then(function(answer) {

	    	if (answer.question === "n"){
	    		runSearch();
	    	}
            else{
            	console.log("Good bye!");
            	connection.end();
            } 
		});       
}
