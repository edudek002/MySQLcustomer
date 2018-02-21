var inquirer =require("inquirer");
var mysql =require("mysql");

var items_left;
var new_stock;



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
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
      message: "What would you like to do?",
      choices: [
        "View products for sale",
        "View low inventory",
        "Add to inventory",
        "Add new product"
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
          addProduct();
          break;
      }
    });
}

//view products for sale
//list every available item

function viewProductsForSale() {
  console.log("-----------------------------------");
  console.log("ALL AVAILABLE ITEMS");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log();
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
}



//view low inventry

function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("LOW INVENTORY ITEMS");
      console.log();
      console.log("There are now " + res[i].item_id + " : " + res[i].product_name + " has low inventory of " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
}



//add to inventory




function addToInventory () {
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
	        message: "What is the amount of the item you would like to add?\n"
	      }
	    ])
	    .then(function(answer) {

	    	var query = "INSERT INTO products SET ?";
            connection.query(query, 
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
		        },
		        

		        function(err, res) {
		            for (var i = 0; i < res.length; i++) {
            		items_left=res[i].stock_quantity;
            		var ID = res[i].item_ID;
            		console.log("We have " + res[i].product_name + " " + res[i].department_name);
		            }
	   //////////////////////////////////////////////// 	
			    	//new_stock = items_left - (-answer.addNumber);
			    	//new_stock = answer.addNumber + items_left;
			    	/*
		            console.log("You now have " + new_stock + " items with ID = " + ID);
			    	var query = "UPDATE products SET ? WHERE ?";
			    	console.log("see me");
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
				          
				            console.log("We have a total of ")// + res[i].stock_quantity + " items left with ID = " + res[i].item_ID);
			        	}
			        );
			    	console.log("Your inventory was updated!");
			    	*/
				}
			);
	    });
}


//add new product
/*
function addProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: blouse,
      department_name: womens,
      price: 55,
      stock_quantity: 18
    },
    function(err, res) {
      console.log(" product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
    }
  );
 }
 */

function addProduct () {
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
	        message: "How many items woud you like to add?"
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
            		console.log("We have " + items_left + " items left with ID = " + res[i].item_ID);
		            }
	   //////////////////////////////////////////////// 	
			    	new_stock = items_left - (-answer.addNumber);
			    	//new_stock = answer.addNumber + items_left;

		            console.log("You now have " + new_stock + " items with ID = " + ID);
			    	var query = "UPDATE products SET ? WHERE ?";
			    	console.log("see me");
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
				          
				            console.log("We have a total of ")// + res[i].stock_quantity + " items left with ID = " + res[i].item_ID);
			        	}
			        );
			    	console.log("Your inventory was updated!");
				}
			);
	    });
}

 
