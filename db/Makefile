SHELL=/bin/bash

PGHOST=localhost
PGPORT=31415
PGUSER=lunchroulette
PGPASS=lunchroulette
PGDB=lunchroulette
PGDATA=/var/lib/postgresql/data/lunchroulette

.PHONY: run init psql reset

run:
	docker rm -f lunch-roulette-db || true
	docker run \
		--name lunch-roulette-db \
		-e POSTGRES_USER=$(PGUSER) \
		-e POSTGRES_PASSWORD=$(PGPASS) \
		-e POSTGRES_DB=$(PGDB) \
		-e PGDATA=$(PGDATA) \
		-p 31415:5432 \
		-v $$HOME/data/lunchroulette:$(PGDATA) \
		-d postgres

init:
	PGPASSWORD=$(PGPASS) \
	psql \
		-d $(PGDB) \
		-U $(PGUSER) \
		-h $(PGHOST) \
		-p $(PGPORT) \
		-a -f schema.sql

psql:
	PGPASSWORD=$(PGPASS) \
	psql \
		-d $(PGDB) \
		-U $(PGUSER) \
		-h $(PGHOST) \
		-p $(PGPORT)

reset:
	docker rm -f lunch-roulette-db || true
	rm -rf $$HOME/data/lunchroulette
	PGPASSWORD=$(PGPASS) \
	docker run \
		--name lunch-roulette-db \
		-e POSTGRES_USER=$(PGUSER) \
		-e POSTGRES_PASSWORD=$(PGPASS) \
		-e POSTGRES_DB=$(PGDB) \
		-e PGDATA=$(PGDATA) \
		-p 31415:5432 \
		-v $$HOME/data/lunchroulette:$(PGDATA) \
		-d postgres
	@DONE_LINE="PostgreSQL init process complete; ready for start up."; \
	echo "Waiting for \"$$DONE_LINE"\"; \
	while true; do \
		docker logs lunch-roulette-db | tail -n 20 | grep "$$DONE_LINE"; \
		if [ $$? -eq 0 ]; then \
			sleep 5; \
			break; \
		fi; \
	done

	echo "Initializing DB"
	PGPASSWORD=$(PGPASS) \
	psql \
		-d $(PGDB) \
		-U $(PGUSER) \
		-h $(PGHOST) \
		-p $(PGPORT) \
		-a -f schema.sql

logs:
	docker logs -f lunch-roulette-db