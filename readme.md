
# Smile. Mood-tracker
The Smile. mood-tracker is a simple web application that allows the user to enter a mood rating from 1-5 each day and the activities they were doing for that day. This helps people keep a record of how they were feeling and track any patterns in their mood cycles and activities on a daily basis. It is designed to be minimal and simple to use. The decision was made to only allow the user to enter one record per day to ensure the record was a summarized outlook of the entire day and not specific to a certain time or mood.

### Widget Wizard link
Widget Wizard can be accessed here: 

https://smile-moodtracker.herokuapp.com/

Please use the following credentials to test.  

login : test@test.com   
password : test   

## Smile. Features
Smile. features a simple and elegant login and registration page. On login the user is directed to fill out a mood record for the current day. If a mood record is already found the user is directed to the main dashboard page. The dashboard page shows all mood records at a glance on an interactive calendar. On selection of a day the mood details are shown below the calendar giving a summary of the mood rating and activities from that day. The user can then choose to edit the record if desired.

The application was designed to be simple and easy to use keeping options to a minimum. The mockup is a wireframe design and would benefit from more advanced ux styling and colour scheme.

Login
--------------

<img src="https://i.ibb.co/M5CSgG8/Screen-Shot-2021-04-28-at-10-26-13-am.png" alt="Login Interface" width="300"/>

Dashboard
--------------

<img src="https://i.ibb.co/Mnm0dq8/Screen-Shot-2021-04-28-at-10-26-27-am.png" alt="Dashboard Interface" width="300"/>

Mood Input
--------------
<img src="https://i.ibb.co/sJfQwMm/Screen-Shot-2021-04-28-at-10-26-40-am.png" alt="Mood Input" width="300"/>

--------------------------------------

## Smile. application development 
The main application development was structured around a node express server paired with a postgres database and a react front end. This allowed keeping user records private and allowing for advanced front page rendering of complex components on a single page. The following libaries were used during the development process.

- Node
- Express.js
- Passport.js
- Bootstrap.js
- Sass
- react-router-dom
- Postgres
- Axios
- Bcrypt
- Dotenv

### Difficulties
Implementing the passport authentication system was at first tedious due to the lack of supporting documentation when connecting with a postgres database. I worked through this by throroughly reading all documentation available and reviewing exisiting code bases on github for insight as to how the code should be structured. After the initial implementation Passport.js was very useful in making the authentication process for the rest of the app very simple. I believe utilising this library in the future would be a smoother and quicker process after going through this process.

## Lessons learned
- Using NodeJS for server-side development
- Communicating client, server and database information
- Utilizing react for front-end development
- Using new libraries and understanding how best to implement them
- Implementing BCrypt and express-session with NodeJS and Passport.js
- Sending database information from the back-end to front-end in usable data structures
- Using both class components and functional components in react
- Deploying a full stack application project to Heroku 