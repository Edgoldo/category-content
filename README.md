# Category Content
System for managing multimedia content by type of user

## Install the application

In a terminal go inside the category-content folder and install the dependencies

´$ npm i´

## Create the environment file

Using the env.example file, make a copy in the root folder of the project on the file .env and update the required variables inside of it using your valid local values.

## Create the public folder to upload files

In the root of the project you need to create a new folder called ´uploads´ and set the required permissions to keep it as a public folder.

## Run the project

Go to the root folder of the project and execute in a terminal:

´$ npm start´

## Available routes

All the routes are configured inside the src/routes folder:

Authentication and User endpoints, prefix ´/api/auth´:

´´´
POST: /register
POST: /login
GET: /me
PUT: /update
´´´

Content endpoints, prefix ´/api/content´:

´´´
GET: /
GET: /category/:categoryId
GET: /:id
POST: /'
PUT: /:id
DELETE: /:id
´´´

Category endpoints, prefix ´/api/categories´:

´´´
GET: /
GET: /summary
GET: /:id
GET: /search
POST: /
PUT: /:id
DELETE: /:id
´´´

Public route to upload files:

´/uploads´


