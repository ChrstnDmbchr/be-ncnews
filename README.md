# NCNews Backend API
An API built with Node, Express and MongoDB that will serve data to the front end application in the Northcoders News sprint.

## Prerequisites

#### Database connections
The database connections strings are in the `dbconnection` directory and this is where the information is source depending on whether the `process.env.NODE_ENV` variable has been set to dev or test. 

If you wish to change the name of the databases created this can be modified in `dbconnection/index.js` as follows:
```
exports.devUrl = 'mongodb://localhost:27017/<NEW DB NAME>'
exports.testUrl = 'mongodb://localhost:27017/<NEW DB NAME'
```

By default the databases will be named `ncnews` and `ncnews-test` respectively.

If you wish to re host this app on Heroku set the environment variable of the hosted database connection string to `MONGODB_URI`.

#### Database seeding

Seeding scripts have been provided to seed both dev and test databases.

To seed the dev database run:
```
npm run seed-dev
```
To seed the test database run :
```
npm run seed-test
```
NOTE: Only the dev seed script is required before the app runs, the test database will be seeded before every test block.

## API Routes

``` http
GET /api
```

Serves an HTML page with documentation for all the available endpoints

``` http
GET /api/topics
```

Get all the topics

``` http
GET /api/topics/:topic_id/articles
```

Return all the articles for a certain topic

``` http
POST /api/topics/:topic_id/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "this is my new article title", "body": "This is my new article content"}`

``` http
GET /api/articles
```

Returns all the articles

``` http
GET /api/articles/:article_id
```

Get an individual article

``` http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

``` http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: `{"comment": "This is my new comment"}`

``` http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

``` http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

``` http
DELETE /api/comments/:comment_id
```

Deletes a comment

``` http
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user.

## Testing
All API enpoints have been tested against the data that was seeded with the test database.

The test database is re-seeded everytime before the test suite is ran.

To run the test suite run the script:
```
npm test
```

## Hosting

The backend API is hosted on Heroku and the Mongo DB is hosted on Mlabs

[Click Here](https://fast-hamlet-42674.herokuapp.com/api) to access the routes page.

