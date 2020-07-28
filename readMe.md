Free-Cycle for term-2 midterm project

[App link on heroku](https://free-cycle.herokuapp.com/)

- `/` - nothing but a landing page, I like the picture and that`s all
- `/unauthorized` - when user trying to access pages when they don`t have the access, will be redirected to this page.
- `/api/users`
    - GET
      - `/login` simple login form
      - `/register` simple register form
      - `/profile` display user`s own information, can access update profile page from here
      - `/update-profile` simple update-profile form
      - `/view-profile/:id` user can view other user's information,find the user's profile through `:id` ie all the active posts that user have.
    - POST
      - `/register` all fields are required. Email address needs to be unique
      - `/login` check user input against database, redirect if true.
    - PUT
      - `/update-profile` update user's information
      - `/update-password` update user's password
- `/api/posts`
  - GET
    - `/create-new` simple form to create a new post
    - `/get-all` grab all the posts in the database and display it
    - `/get-category/:category` grab only the posts belongs to this `:category`
    - `/single-post/:id` view individual post, `:id` = id of the post
    - `/edit-post/:id` edit form, only the owner of the post can access this page
  - POST
    - `/create-new` minimum information is need to create a new post. Default image is set so can be edited later
    - `/picture/:id` user can upload single or multiple images to the post
  - PUT
    - `/edit-post/:id` user can edit the post and update the database
  - DELETE
    - `/single-post/:id` user can delete their own posts once their item has been claimed or the post been inactive for a long period of time. Comments that's attached to the posts will be deleted from the database as well.
- `/api/comments`
  - POST
    - `/add-comment/:id` user can add a comment to the post of `:id` 

## You are more than welcome to fork and play with the app locally
Thing's you have to do before it works
- install all npm packages
- Create .env file in root
  - you should include following
    -  MONGODB_URI
    - SESSION_SECRET
- You can seed your database with `npm run seed` this will create 8 default posts and 1 default user
