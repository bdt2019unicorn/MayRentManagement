# MayRentManagement

<details><summary><h2>Problem</h2></summary>
	
- An owner has many appartments in a building to rent out and need to separate ncome, expenses, utilities and tenants for each of them 
- Previously, the management is done with Excel which makes thing very complicated to separate the buildings and being scalable because of multiple sheets when many different complicated actions to pull the data 
- Most of the data is stored in Excel and the input is in Excel so need to be able to import the data and export the whole data if we are about to use a system 
- <details><summary>Rent period is not tracked well with Excel and it creates mistake with people getting duplicate charged in their rent</summary>
	
	- There is no way for the admin to see if the customer has overdue their rent payment for too long and too much based on the payment record 
	- Tenant is allowed to pay part of the invoice because of financial situation during COVID and the administrator faces a problem when tracking it. 
	</details>
- <details><summary>Excel could not control the user and their permissions</summary>
	
	- Admin can do everything from approve users, add, edit and delete and bulk action 
	- Moderator can only add and edit but not import and bulk action 
	- Viewer can not change anything in the system, only to see the data
	</details>
- Invoice for customer is created manually with Word and Excel, which creates many human mistakes from taking the wrong data 
- Change in invoice format can lead to huge changes with everything bacause of the manual process 
	
</details>

<details><summary><h2>Solution</h2></summary>
	
- <details><summary>A simple management system for add, edit, delete and import Excel for the simple properties</summary>
	
	- tenants
	- buildings
	- income 
	- expense 
	</details>
- Excel template needed to be generated with the select options to avoid picking the wrong option 
- Data for each buildings in the system needs to be classified and separated  
- Invoice charged sent to the tenants needs to start from the end of the last invoice period
- When the admin accidentally delete an invoice, the rent period in that invoice should be included in the next invoice 
- <details><summary>The application needs to be able to give certain user certain permissions depending on their roles</summary>
	
	- Admin can do everything from approve users, add, edit and delete and bulk action 
	- Moderator can only add and edit but not import and bulk action 
	- Viewer can not change anything in the system, only to see the data
	</details>
- Admin needs to be able to back up data and restore data when human error happens 

</details>
	
<details><summary><h2>Features</h2></summary>
	
- <details><summary>Admin Content Management system</summary>
	
	- Approve registration 
	- Innitialize the database 
	- Submit an issue for changes 
	- Run a query for database changes 
	- Submit an issue for developer for maintainance 
	</details>
	
- <details><summary>Authentication</summary>
	
	- Login: determine the user data and also have the information about their permissions 
	- Signup: user register to control in the front and get approved from the CMS by admin 
	</details>
- <details><summary>Dashboard</summary>
	
	- <details><summary>Buildings: information about all the buildings in the app</summary>
	
		- add 
		- edit 
		- delete 
		- import and export Excel 
		</details> 
	
	- Utilities type: all the utilities types - they are classify as the one to be charged only once, periodically charged, rent and the charge with numbers
	- Backup data and restore the application from backup data 
	</details>
- <details><summary>Building management: all the feature here will have to make sure the data for one building does not get duplicated in the other building in the same system</summary>
	
	- <details><summary>apartments: all the units for rent inside a building. Also need to show the one which is empty first so the admin can talk to marketing and agency about available options</summary>
	
		- add
		- edit 
		- delete 
		- import and export Excel 
		</details>
	- <details><summary>tenant: people who rent the property along with the aparment they are in</summary>
	
		- add
		- edit 
		- delete 
		- import and export Excel 
		</details>
	- <details><summary>income: all the possible income coming from invoices from tenants and the other source such as tax refund, little garage sales</summary>
	
		- add 
		- edit 
		- delete 
		- import and export Excel 
		</details>
	- <details><summary>expenses: the cost which the building has pay for operation</summary>
	
		- add 
		- edit 
		- delete 
		- import and export Excel 
		</details>
	- <details><summary>lease aggreement </summary>
	
		- <details><summary>list</summary>
	
			- all the contracts in the building, this needs to display the amount the tenants in an appartment already paid along with their bond compared to the invoice being charged
			- compare the end date of the lease to see when the room is available for the next person 
			- compare the start date of the new lease to the empty room to see if the admin can get someone to fill the room in between 
			</details>
	
		- resolve old contract: when import contracts from Excel, there are contracts which has been paid for a long time. The admin does not want to put all their invoices and the payment they made. This is to make sure the admin can choose a date for all the old contracts to be paid until so they can be started the new invoice period fresh 
		- add 
		- edit 
		- delete 
		- import and export Excel 
		</details>
	- <details><summary>invoices: manage all the invoices sent to the tenants and make sure the period is tracked right</summary>
	
		- add: add the invoice for the tenant, for the rent, we will need to get the data from the last invoice to make sure the invoice reflect the correct start date. Rent calculation is based on the period times the amount 
		- edit: if one of the charge is rent, that part won't be able to be edited for the date. This is to make sure the change of the invoice does not create a chain reaction to other invoices if there exists invoices with rent charge after. That part can only be deleted 
		- delete 
		- print invoices: bulk print invoices for all the whole building or just choose to print a particular invoice. Invoice can be print in PDF and Excel format 
		</details>
	- <details><summary>utilities: every month, a person will go to different appartment and write down the number of the measurement clock for each building. The price for periodic utilities such water and electricity also changes after a couple months. So, the calculation needs to take these into account</summary> 
	
		- add: this is to add a new number to the record, the new number has to be bigger or equal to the previous one for the same appartment
		- view appartment utilities and the potential cost
		</details>
	- <details><summary>documents: all customer documents such as their photo ID, their lease aggreement and other relevant documents related</summary>
		
		- add
		- edit 
		- delete 
		</details>
	
	</details>
</details>


## Technical solution
- 
- General functions: 
	- Database action:
		-  Enviroment variables
			- test mode: store data in the disk file in the server, not in the database if the test mode is on 
			- username: database username 
			- password: database password 
		- Create connection 
			- check the test mode and choose the correct database. If it is test mode, use SQLite. Otherwise, use MySQL. 
	- Bulk insert: 
		- Depending on the table, need to convert the Excel columns to the right column from database. 
			- For the column which users can choose by name such as Building, need to convert that building name to the corresponding building ID. 
			- For date column, need to make sure to convert the format Date Month Year to Year Month Date so it can go to the database table 
			- For columns which are not in the column list, ignore them. 
		- Convert all the columns to the insert query
		- Execute all the queries as a transaction and roll back if there is any errors. 

