VisitorsStatistics
==================

Sample application &amp; dashboard for AppServer.
This app uses the third-party backend ([parse.com](https://parse.com/)) to store information about visitors.

Deploy the server-side code to parse.com.
------------------
1. Clone this repository.
2. Register an [parse.com](https://parse.com/) account and create the new application.
3. Install the parse [command line tool](https://parse.com/docs/cloud_code_guide#started).
4. Run ./server/install.sh script and enter the required information (Application name, Application ID, Master Key, etc). The script will generate the necessary config files.
4. Now you can deploy your server-side code to parse.com: 
    	cd server
    	parse deploy
