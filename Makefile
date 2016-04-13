PASS=$(shell echo $$LAURADOCKERPASSWORD)

clean: 
	docker rmi fyp/authenticationtest; docker rmi fyp/authentication

build-test:
	docker build -f Dockerfile-test -t fyp/authenticationtest .

test: build-test
	docker run --rm -v $(shell pwd)/src:/authentication fyp/authenticationtest

build:
	docker build -t fyp/authentication .

release: build
	docker login -e laurafitzgeraldsemail@gmail.com -u laura -p $(PASS)  
	docker-laura.ammeon.com:80 && docker tag -f fyp/authentication 
	docker-laura.ammeon.com:80/fyp/authentication && docker push docker-laura.ammeon.com:80/fyp/authentication
