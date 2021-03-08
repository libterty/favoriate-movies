# Movies Favorite

- If you are a movies lover, here is the right places to be. In this repo you can easliy running an entire application with `make` script.
In this moive application you will be able to real-time sharing your favorites movies with the other users.

## Prerequisite

- Here are some essential tools that you need to have to running project properly, and some optional tools if you want to change the repository.
And please feel free to make any changes that suit your interest.

- [docker](https://www.docker.com/)
- [make](https://www.gnu.org/software/make/)
- [node(Optional)](https://nodejs.org/en/)
- [PostgreSQL(Optional)](https://www.postgresql.org/)
- [Typescript(Optional)](https://www.typescriptlang.org/)

## tl;dr

- This is the first MVP of the favorite movie. The feature includes create/update/read/delete movies, also support authentication. But only write/update operation requires to be login. Meanwhile, the movies is connected to server
with websocket to support real-time data. And each create/update movie request will store in `auditlog` table just
for reference only. Maybe, someday in the future, the app will become more user friendly in UI, and supporting
distributed services design. And we may or may not change to use KAFKA for streaming data in the future.

### Get Started

- Once you finished pulling the repository, you will have a simple file structure like this. To look up more specificly you can exec `tree -I 'node_modules|dist|public'`

```text
├── LICENCE
├── Makefile
├── README.md
├── apps
├── docker-compose.yaml
└── services
```

- If you are not going to make any changes, the only two things you need is inside `docker-compose.yaml` and `Makefile`. To execute and running the application.
You can start with `make help` to see what kinds of commands you can use. That's get started.

### Install and Run

-- Before running the application you need to build the entire app first, if you have questions about `make` commands go down below and take a look what our `makefile` can help you.

```shell
// Build Application
make build
```

-- Once you finished building the application, you will know be able to spin up the multi-containers. 

```shell
// Run Application
make up

```

** The App will running on `localhost:8080` as default, if you want to make any change, feel free to do so. **


-- When you finished spinning up the application, you can go and see this log if you wanted. If you have any
questions about logging, see `make logs` command down description below.
-- In order to create a new movie, movie is required to have actors data in it. We have already prepare some
sample actor data from `Back4App`. Try `make sh` commands to generate sample actors data.

```shell
// When your server is up, sh into your server
make sh c=movies-server
// once you are in, type npm run generate
npm run generate
// after create sample data, you are now good to go, type exit to exit
exit
```

#### Helper command

- list all commands available for make

```shell
make help
```

#### Build command

- build the image from Dockerfile. In our applications we have a server build on top of Nestjs framework, and Vue Typescript frontend binding with Nginx.

```shell
make build            # building all containers
make build c=database # building database only
make build c=server   # building server only
make build c=app      # building app only
```

#### Up command

- Stopping and recreating the containers

```shell
make up            # up all containers
make up c=database # up database only
make up c=server   # up server only
make up c=app      # up app only
```

#### Start command

- Is used to start the containers. To start only one container for example if I only want to start db container run `make start c=database`

```shell
make start            # starting all containers
make start c=database # starting database only
make start c=server   # starting server only
make start c=app      # starting app only
```

#### Down command

- Is used to stop and remove containers. To delete specific container use for example if I only want to delete db container run `make down c=database`

```shell
make down            # delete all containers
make down c=database # delete database only
make down c=server   # delete server only
make down c=app      # delete app only
```

#### Restart command

- Is used to restart containers. To restart specific container use for example if I only want to restart db container run `make down c=database`

```shell
make restart            # restart all containers
make restart c=database # restart database only
make restart c=server   # restart server only
make restart c=app      # restart app only
```

#### Logs command

- Is used to see the log of the containers. To log specific container use for example if I only want to log db container run `make log c=database`

```shell
make log            # log all containers
make log c=database # log database only
make log c=server   # log server only
make log c=app      # log app only
```

#### Sh command

- Is used to see sh into containers. To log specific container use for example if I only want to sh server container run `make sh c=movies-server`

```shell
make sh c=movies-db       # log database only
make sh c=movies-server   # sh server only
make sh c=movies-app      # log app only
```
