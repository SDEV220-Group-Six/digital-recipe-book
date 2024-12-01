# Digital Recipe Book
All your recipes in one place!

After git clone, the root folder will be named `digital-recipe-book`.

## URL
`https://sdevgroupsix.pythonanywhere.com`

## Cloning the Project
Open a terminal and navigate to the (parent) folder where you want to save the code. Run the following command:
`git clone https://github.com/SDEV220-Group-Six/digital-recipe-book.git`

Running the above command will create a new folder containing the project. Navigate to that folder: `cd digital-recipe-book`

## Creating Your Own Branch
The **first** thing you should do after cloning the project is to create your own branch. Doing so will prevent you from possibly causing conflicts with the main branch. With that in mind, run the following command immediately after you cloned the project:
`git checkout -b branch-name`

## Installation and Activation
In order to correctly run the application on your local machine, you will need to set up a virtual environment in which all required packages will be stored.

If you have cloned the project, navigated to its directory (`digital-recipe-book`) and create your own branch, you should proceed with running the below commands to setup the virtual environment:

**If you are on a Windows machine, the commands below will need to use "python" instead of "python3"!**

`python3 -m venv django` - this command creates a virtual environment named django for the project. If, for some reason virtualenv is not already contained in your python installation, run the following: `pip install virtualenv`.

### Activating the Virtual Environment
Windows: `django\Scripts\activate` when using Command Prompt OR `.\django\Scripts\activate`for PowerShell.

Mac: `source django/bin/activate` - activates the environment so that packages are installed only within this project.

### Installing Django, Checking Version, and Running the Server
Next three commands are used to install django, check version and run the server once everything has been set up. However, due to other packages being installed in the meantime, it would be best to just keep this for reference and actually use pip to get all packages from the `requirements.txt` file.

`python3 -m pip install Django` - installs Django within the virtual environment.

`django-admin --version` - checks the Django version to confirm it’s installed correctly.

`python3 manage.py runserver` - to view the project locally, this starts the Django development server

### Installing Packages (incl. Django)
`pip install -r requirements.txt` - installs all other packages (incl. django if not done in previous steps) into the virtual environment.

### Database Migrations
The first time you start the Django server, there will probably be a message in the console saying that you are missing migrations. To fix that, stop the server (Ctrl+C), run `python3 manage.py migrate` then restart the server.

If any changes are made to the database models (e.g. new model added and perhaps even new attributes added to existing models), you will probably need to run `python3 manage.py makemigrations <insert_app_name>` to create a migrations file. To "activate" those changes you will need to run `python3 manage.py migrate <insert_app_name>` again.

#### Project Apps
Currently the project (`recipebook`) has a single app, called `recipes`. Any migrations will need to be applied to that app. When we eventually create the `shopping-list` app, the above commands regarding migrations will have to be checked/updated.

### Creating Superuser and Users
Due to the database not being cloned, you will need to create a superuser to be able to login into both the app, as well as in the /admin panel.

`python3 manage.py createsuperuser` (Mac) or `python manage.py createsuperuser` (Windows).
Follow the prompts. As the user will only be created on your local machine, you could create an admin(user) and admin(password) account for easy access. You can do that by typing `y` in the final prompt.

As the application is designed to display ingredients and recipes/shopping lists (eventually) based on the user that created them, it would be a good idea to create different users to test that behavior. That can be done via the admin panel after logging in as a superuser.

Ideally we will also implement groups at some point, so that we would simulate a business using this recipe book. We will probably have to update the queries at that point, but for now different users are sufficient.

#### Adding /media folder
The application is currently designed to store image files uploaded by users into a /media/ folder. This folder will not be clone as it's on the .gitignore list. To solve this, you will have to create the /media/ folder just below the root (e.g. `digital-recipe-book/media`).

## Getting Latest Updates From the *main* Branch
It's possible that while you are working on your branch, changes have been done to main. It is a good idea to get those changes before trying to push your own to GitHub. To do this, run the following commands:

`git checkout your-branch` - make sure you are working on your branch

`git fetch origin` - fetch the latest changes from the remote repository. This updates your local information about the remote branches but does not change your working directory.

`git merge origin/main` - merge any changes from origin/main (the main branch on the remote) into your branch to make sure you’re up-to-date. This allows you to test and address any conflicts locally before pushing your work. If there are any conflicts, Git will prompt you to resolve them.

## Pushing Your Changes
After merging, if you had to resolve conflicts or added new changes, you may need to push your branch back to the remote repository:
`git push origin your-branch`

## Additional Info
Use own branch/branches to make changes.

Open pull requests with main branch in order to merge your changes.

Everyone can and should do code reviews on all open pull requests and approve or decline them.