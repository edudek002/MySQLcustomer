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
  console.log("\nconnected as id " + connection.threadId + "\n");
  queryAllProducts();
  //updateProduct();
});

//function that lists all product including item number, name and price
function queryAllProducts() {

  console.log();
  console.log("ALL AVAILABLE ITEMS:");
  console.log("-----------------------------------");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------\n");
  });
}


//function that lets the user search the quantity of items left
//and then lets the user buy items if there is sufficient inventory
function IDSearch() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "What is the ID number of the item you are looking for?\n"
      },
      {
        name: "number",
        type: "input",
        message: "How many items would you like to buy?"
      }
    ])
    .then(function(answer) {
      var query = "SELECT item_ID, stock_quantity, price, product_sales FROM products WHERE ?";
      connection.query(query, 
        { 
      	  item_ID: answer.ID 
        }, 
        function(err, res) {
          for (var i = 0; i < res.length; i++) {
            items_left=res[i].stock_quantity;
            var item_price = res[i].price;
            total_cost =answer.number * item_price;
            var initial_sales = res[i].product_sales;
            var updated_sales = initial_sales + total_cost;
            console.log("\nINFO FOR CUSTOMER:");
            console.log("\nWe have " + items_left + " items left with ID = " + res[i].item_ID);
          }
          if (items_left>=answer.number) {
            console.log("You will receive your " + answer.number + " items in the mail.\n");
            console.log("Your total cost will be " + total_cost + " dollars.");
            new_stock = items_left - answer.number;
          }
          else 
          {
            console.log("We are sorry but we have insufficient quantity of this product.");
            console.log("Try again later!");
            connection.end();
          }
              
          var query = "UPDATE products SET ?, ? WHERE ?";
          connection.query(query,
            [
              {
                stock_quantity: new_stock
              },
              {
                product_sales: updated_sales
              },
              {
                item_ID: answer.ID
              }
            ],
            function(err, res) {
              console.log("-----------------------------------");
              console.log("Products are updated!\n");
            }
          );  
        queryAllProducts();
        exit();
        }
      );

    });
}

IDSearch();

function exit () {
  inquirer
      .prompt([
        {
          name: "question",
          type: "input",
          message: "Do you want to buy another item? Type 'y' or 'n'.\n"
        },
      ])
      .then(function(answer) {

        if (answer.question === "n"){
          console.log("Thank you for your purchase!");
          connection.end();
        }
        else{
          IDSearch();    
        } 
    });       
}



