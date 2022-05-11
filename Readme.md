#Project description
IBLOG website is a individual blogging website dedicated to those who love writing their thoughts and feelings there. 
Application consists of several functionalities ranging from Signing up to Creating posts into website. There are signing up, signing in, creating, 
editing, deleting, reading functionalities of posts as well as categories related to topic of post. 

Users mainly can do followings:
- Guest users only read published articles
- Users can register and login into app
- Registered user can create, edit and delete posts and see their credentials in My activities page, and edit, delete their profile from app

App has been finished successfully and running on the server. Later on, it is planned that there will be a couple of functionalities to add:
- Registered users can upload their profile image;
- Users can rate post according to their quality;

#Bugs and problems around IBLOG app
Regarding problems currently exists on the app, there are still some error handling problems when fetching data from Backend and showing them into 
user. Fetching data takes some time to deliver complete data into app.

#Technologies used in the project

Backend
- Express - easy and light node js project to create api
- Nodemon - easy local server starting package instead of repeating `node index.js`
- Mysql - relational database language
- Bcrypt - for protecting passwords from public view by hashing them
- dotenv - to get `.env` file variables
- multer - easy file uploading package 

Front End
- HTML - for skeleton of website
- CSS - for styling HTML elements
- JavaScript
- Fetch - to get api data from backend 
- Bootstrap - ready to use css components and classes

#ERD diagram
[![erd.png](https://i.postimg.cc/zvk7p7Gp/erd.png)](https://postimg.cc/H8VbkQ57)
- User table saves data of user registered into app. It asks firstname, lastname, email and password credentials from user
- Category table create category catalog of each post. It saves category name column
- Post table contains data of each posts getting title, content, photo info and has a relationship with both user and category. post_author_id 
  identifies owner of post whereas post_category_id is category relationship of post

#How to start project locally

- To start project locally run following command: `npm run devStart`

- For deployment purpose you want to do following:   `npm start`

#Website look

[![signup.png](https://i.postimg.cc/DyRr3R4H/signup.png)](https://postimg.cc/9rtRG8pY)
- User can register with following form

[![signin.png](https://i.postimg.cc/zfx38RPv/signin.png)](https://postimg.cc/d7TJ9DFc)
- Once user registered it is redirected to login page where they can enter writing-allowed area of app

  [![navbar1.png](https://i.postimg.cc/6qWKH9XZ/navbar1.png)](https://postimg.cc/JD2S0Ct7)
- User can see their name in navbar, and some functionalities is allowed after logged in like My activities and Create post

[![createpost.png](https://i.postimg.cc/0yWCjZj1/createpost.png)](https://postimg.cc/mP996Y7m)
- User can post by following modal component

[![activity.png](https://i.postimg.cc/dtQdCdzs/activity.png)](https://postimg.cc/7bcf8CHd)
- And lastly, user see own posts in my activities page and edit profile info there