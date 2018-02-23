var inquirer =require("inquirer");
var mysql =require("mysql");
const cTable = require("console.table");

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
        "View products sales by department",
        "Create new department",
        "Oops! delete last department",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View products sales by department":
          viewProductsSales();
          break;

        case "Create new department":
          createNewDepartment();
          break;

        case "Oops! delete last department":
          deleteDepartment();
          break;

        case "Exit":
          exit();
          break;
      }
    });
}

//function that displays name of the department, overhead costs, product sales and total profit

function viewProductsSales() { 

	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales "; 
	query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
	query += "ORDER BY departments.department_id ";

  	query = connection.query(query,

	  	function(err, res) {
	  		//console.log(err);
        //var values =[];
	    	for (var i = 0; i < res.length; i++) {
          res[i].total_profit=res[i].product_sales-res[i].over_head_costs;
          console.log(res[i].department_id + " | " + res[i].department_name + " | " + res[i].over_head_costs + " | " + res[i].product_sales + " | " + res[i].total_profit);
          
          //this is information to use with a table npm
          /*
          var values[i] = [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit];
          values.push(values[i]);
          console.table(["department_id","department_name", "over_head_costs", "product_sales", "total_profit"], values);
          */
        }
      console.log("End of products.")
      console.log();
      console.log("-----------------------------------\n");
  	  runSearch();
    });
} 

//add new product to inventory function
function createNewDepartment () {
  inquirer
      .prompt([
        {
          name: "department_name",
          type: "input",
          message: "What is the name of the department you would like to add?\n"
        },
        {
          name: "over_head_costs",
          type: "input",
          message: "What are the over head costs in the department you would like to add?\n"
        }
      ])
      .then(function(answer) {

        var query = "INSERT INTO departments SET ?, ?";
            connection.query(query,
              [
            { 
              department_name: answer.department_name 
            },
            { 
              over_head_costs: answer.over_head_costs 
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
            console.log("You added a new department!");
            console.log("-----------------------------------\n");
        runSearch();
        }
      );
    });
}

function deleteDepartment() {
    console.log("Deleting all departments added by the supervisor...\n");
    connection.query(
      "DELETE FROM departments WHERE department_id>3",
   
      function(err, res) {
        console.log(res.affectedRows + " departments deleted!\n");
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

