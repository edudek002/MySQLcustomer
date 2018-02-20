var inquirer =require("inquirer");
var mysql =require("mysql");

var new_stock;

//view products for sale
//list every available item

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

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

viewProductsForSale()

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

viewLowInventory()

//add to inventory

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
	        message: "How many items woud you like to add?"
	      }
	    ])
	    .then(function(answer) {
	    	var query = "UPDATE products SET ? WHERE ?";
	    	console.log("see me");
	        connection.query(query, 
		    [
               {
                   stock_quantity: answer.addNumber
               },
               {
                   item_ID: answer.ID
               }
            ],

	        function(err, res) {
	          for (var i = 0; i < res.length; i++) {
	          	//console.log("dont see me");
	          	new_stock=res[i].stock_quantity+answer.addNumber;
	            console.log("We have " + new_stock + " items left with ID = " + res[i].item_ID);
	        	}
	        console.log("Your inventory was updated!");
        	}
        );

    });

}

addToInventory ();
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
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
    }
  );
 }

  addProduct();
*/