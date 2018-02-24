This App is similar to the Amazon App. The application has three interfaces: "customer", "manager" and "supervisor". It uses npm inquirer and npm mysql.

After you install mysql package you will create database with 2 tables "products" and "departments". Populate the "customers" tables with the following columns: item_id, product_name, department_name, price, stock_quantity, product_sales. Populate the "departmentss" tables with the following columns: department_id, department_name and over_head_costs.

"Customer" interface. The app prompts users with two messages: the first asks about the ID of the product they would like to buy and the second asks about how many units of the product they would like to buy.
Once the customer places the order, the application checks if the store has enough of the product to meet the customer's request. If not, the app prevents the order from going through. If the store does have enough of the product, the customer's order is fulfilled. This means the SQL database is updated to reflect the remaining quantity. Once the update goes through, the total cost of the purchase is displayed.

"Manager" interface. The app prompts users with five options: "View products for sale", "View low inventory", "Add to inventory", "Add new product", "Oops! delete last product" and "Exit".
If a manager selects View Products for Sale, the app lists every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, it lists all items with an inventory count lower than five.
If a manager selects Add to Inventory, the app displays a prompt that lets the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it allows the manager to add a completely new product to the store.
If a manager selects Delete Last Product, it allows the manager to delete the product recently added to the store.

"Supervisor" interface. The app prompts users with three options: "View Product Sales by Department", "Create New Department", "Delete New Department" and "Exit".
When a supervisor selects View Product Sales by Department, the app displays a summarized table in their terminal/bash window.
If a manager selects Add New Department, it allows the supervisor to add a completely new department.
If a manager selects Delete Last Department, it allows the manager to delete the department recently added. 





