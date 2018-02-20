var inquirer =require("inquirer");
var mysql =require("mysql");

var items_left;

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
  console.log("connected as id " + connection.threadId + "\n");
  queryAllProducts();
  updateProduct();
});


function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
  });
}


function updateProduct() {
  console.log("Updating quantities...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: 100
      },
      {
        item_ID: 1
      }
    ],
    function(err, res) {
      console.log(" products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      //deleteProduct();
    }
  );

  // logs the actual query being run
  //console.log(query.sql);
}


function IDSearch() {
  inquirer
    .prompt([{
      name: "ID",
      type: "input",
      message: "What is the ID number of the item you are looking for?\n"
    },{
      name: "number",
      type: "input",
      message: "How many items woud you like to buy?"
    }])
    .then(function(answer) {
      //number_required: answer.number;

      var query = "SELECT item_ID, stock_quantity, price FROM products WHERE ?";
      connection.query(query, { 
      	item_ID: answer.ID 
      }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          items_left=res[i].stock_quantity;
          var item_price = res[i].price;
          console.log("We have " + items_left + " items left with ID = " + res[i].item_ID);
        }
        if (items_left>=answer.number) {
          console.log("You will receive your " + answer.number + " items in the mail.\n");
          console.log("Your total cost will be " + (answer.number * item_price))
        }
        else 
        {
          console.log("We are sorry but we have insufficient quantity of this product.")
        }
      });

      var query = "UPDATE products SET ? WHERE ?";

      var new_stock = items_left - answer.number;
      console.log("1 " + new_stock +"2 " + items_left + "3 " + answer.number);
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
        console.log("My products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        //deleteProduct();
      }
    );
    



  });
}

IDSearch();

