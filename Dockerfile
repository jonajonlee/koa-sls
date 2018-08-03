FROM node:8.10

# Deps
RUN apt-get -qq update && apt-get -qq install -y ca-certificates git-core ssh python-pip python-dev build-essential default-jdk jq

# Install aws-cli
RUN pip -q install awscli --upgrade

# Install swagger-codegen-cli 3.0
RUN wget -q http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/3.0.0-rc0/swagger-codegen-cli-3.0.0-rc0.jar -O swagger-codegen-cli.jar

RUN npm i -g npm
RUN npm install -g serverless

# Create app directory for our source code
RUN mkdir /app
WORKDIR /app

# Copy over only files needed to install dependencies
# This will allow Docker to reuse a cached image if no dependencies have changed
# effectively speeding up image build times on local machines
ADD ./package.json /app
ADD ./package-lock.json /app

RUN npm ci -q --no-progress

# Copy over all source
ADD . /app

# Build
RUN npm run build
