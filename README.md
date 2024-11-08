# digital-recipe-book
all your recipes in one place!

## url
`to be updated`

## getting the code
Open a terminal and navigate to the (parent) folder where you want to save the code. Run the following command:
`git clone https://github.com/SDEV220-Group-Six/digital-recipe-book.git`

Running the above command will create a new folder containing the project. Navigate to that folder: `cd digital-recipe-book`

## creating your branch
In order to not overwrite anything on the main branch, run the following command immediately after you cloned the project:
`git checkout -b branch-name`

## getting latest updates from main
It's possible that while you are working on your branch, changes have been done to main. It is a good idea to get those changes first, and only then push your own to github. To do this, run the following commands:

`git checkout your-branch` - make sure you are working on your branch

`git fetch origin` - fetch the latest changes from the remote repository. This updates your local information about the remote branches but does not change your working directory.

`git merge origin/main` - merge any changes from origin/main (the main branch on the remote) into your branch to make sure you’re up-to-date. This allows you to test and address any conflicts locally before pushing your work. If there are any conflicts, Git will prompt you to resolve them.

## pushing your changes
After merging, if you had to resolve conflicts or added new changes, you may need to push your branch back to the remote repository:
`git push origin your-branch`

## installing django
the base application will be cloned or eventually merged into your own branch by following above commands.

however, to install django and be able to add your own apps to the project, the following commands will need to be run inside the base project folder:

`python3 -m venv django` - this command creates a virtual environment named django for the project.

`source django/bin/activate` - activates the environment so that packages are installed only within this project.

`python3 -m pip install Django` - installs Django within the virtual environment; depending on your system, you might need to use python instead of python3.

`django-admin --version` - checks the Django version to confirm it’s installed correctly.

`python3 manage.py runserver` - to view the project locally, this starts the Django development server

### database migrations
If any changes are made to the database models, you may need to run `python3 manage.py migrate` to apply new migrations. However, the `db.sqlite3` file the command created is on the .gitignore list, so keep that in mind.

## info
use own branch/branches to make changes.

open pull requests with main branch in order to merge your changes.

everyone can and should do codereviews on all open pull requests and approve or decline them.

this is just a first draft. above workflow might need changes if we notice something isn't quite right.