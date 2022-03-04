# z_prefix

<!-- Setup Docker Postgres server -->
docker run --rm --name pg-docker-Z -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \
-v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
<!-- docker ps -a      -->
<!-- docker exec -it 4a2424766b3c bash   -->
<!-- createdb -U postgres users -->
<!-- psql -U postgres -->
