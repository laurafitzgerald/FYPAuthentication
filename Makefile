PASS=$(shell echo $$LAURADOCKERPASSWORD)

clean: 
	docker rmi laurafitz/authenticationtest; docker rmi laurafitz/authentication

build-test:
	docker build -f Dockerfile-test -t laurafitz/authenticationtest .

test: build-test
	docker run --rm -v $(shell pwd)/src:/authentication laurafitz/authenticationtest

build:
	docker build -t laurafitz/authentication .

release: build
	docker push laurafitz/authentication
	