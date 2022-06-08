# MayRentManagement

## Table of content 
- [Problem](#problem)
- [Solution](#solution)
- [Features](#features)


## Problem
- An owner has many appartments in a building to rent out and need to separate ncome, expenses, utilities and tenants for each of them 
- Previously, the management is done with Excel which makes thing very complicated to separate the buildings and being scalable because of multiple sheets when many different complicated actions to pull the data 
- Most of the data is stored in Excel and the input is in Excel so need to be able to import the data and export the whole data if we are about to use a system 
- Rent period is not tracked well with Excel and it creates mistake with people getting duplicate charged in their rent. 
	- There is no way for the admin to see if the customer has overdue their rent payment for too long and too much based on the payment record 
	- Tenant is allowed to pay part of the invoice because of financial situation during COVID and the administrator faces a problem when tracking it. 
- Excel could not control the user and their permissions 
	- Admin can do everything from approve users, add, edit and delete and bulk action 
	- Moderator can only add and edit but not import and bulk action 
	- Viewer can not change anything in the system, only to see the data
- Invoice for customer is created manually with Word and Excel, which creates many human mistakes from taking the wrong data 
- Change in invoice format can lead to huge changes with everything bacause of the manual process 

## Solution
- A simple management system for add, edit, delete and import Excel for the simple properties 
	- tenants
	- buildings
	- utilities 
	- income 
	- expense 
- Excel template needed to be generated with the select options to avoid picking the wrong option 
- Data for each buildings in the system needs to be classified and separated  
- Invoice charged sent to the tenants needs to start from the end of the last invoice period
- When the admin accidentally delete an invoice, the rent period in that invoice should be included in the next invoice 
- The application needs to be able to give certain user certain permissions depending on their roles  
	- Admin can do everything from approve users, add, edit and delete and bulk action 
	- Moderator can only add and edit but not import and bulk action 
	- Viewer can not change anything in the system, only to see the data
- Admin needs to be able to back up data and restore data when human error happens 

## Features
- Admin Content Management system
	- Approve registration 
	- Innitialize the database 
	- Submit an issue for changes 
	- Run a query for database changes 
	- Submit an issue for developer for maintainance 
- Dashboard
	- Buildings: information about all the buildings in the app 
		- add 
		- edit 
		- delete 
	- Utilities type: all the utilities types - they are classify as the one to be charged 
	-  
- 


## Technical solution 
- General functions: 
	- Database action:
		-  
		- Create connection 
			- 
	- Bulk insert: 
		- Depending on the table, need to convert the Excel columns to the right column from database. 
			- For the column which users can choose by name such as Building, need to convert that building name to the corresponding building ID. 
			- For date column, need to make sure to convert the format Date Month Year to Year Month Date so it can go to the database table 
			- For columns which are not in the column list, ignore them. 
		- Convert all the columns to the insert query
		- Execute all the queries as a transaction and roll back if there is any errors. 
