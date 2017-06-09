# node-push-notifications
Execute in a terminal using command "node server.js"

Server.js:
This program retrieves a users wakeup and sleep times and sends push notifications through the day
to remind them to take certain tests. 

Things to change and add:
Able to use for multiple users
The program is executed once daily or can change scheduled notifications if database changes

External Node Packages Used:
firebase-admin: to send push notifications and read from the database
node-schedule: to schedule tasks at a given time which is repeated everyday throughout the week
