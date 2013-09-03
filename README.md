VisitorsStatistics
==================

Sample application &amp; dashboard for AppServer.
This app uses the third-party backend ([parse.com](https://parse.com/)) to store information about visitors.

Deploy the server-side code to parse.com.
------------------
1. Register an [parse.com](https://parse.com/) account and create the new application.
2. Install the parse [command line tool](https://parse.com/docs/cloud_code_guide#started).
3. Clone this repository.

    	git clone git@github.com:EchoAppsTeam/VisitorsStatistics.git; cd VisitorsStatistics
3. Copy the settings file:

    	cp settings.sample.cfg settings.cfg
4. Fill in necessary parameters in the settings.cfg
5. Run `./install.sh` and install script will copy the application files to the
    ./build/* directory and make the necessary replacements in these files.

4. Now you can deploy your server-side code to parse.com: 

    	cd build/server/
    	parse deploy
