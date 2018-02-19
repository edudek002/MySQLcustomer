var inquirer =require("inquirer");
var mysql =require("mysql");

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
});

/*
function readColleges() {
  connection.query("SELECT name FROM colleges", function(err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
*/

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
  });
}

function IDSearch() {
  inquirer
    .prompt([{
      name: "ID",
      type: "input",
      message: "What is the ID number you are looking for?\n"
    },{
      name: "number",
      type: "input",
      message: "How many items woud you like to buy?"
    }])
    .then(function(answer) {
      var query = "SELECT item_ID FROM products WHERE ?";
      connection.query(query, { 
      	item_ID: answer.ID,
      	number: answer.number 
      }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Position: " + res[i].item_ID);
        }
      });
    });
}

IDSearch();