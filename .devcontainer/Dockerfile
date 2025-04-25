# Node.js-based, Debian-derived development environment
FROM node:23-slim

# system update and some useful tools
# JRE is required for the SonarQube for IDE extension
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
        git \
        curl \
        net-tools \
        openjdk-17-jre-headless \
        docker.io

# install vite globally (optional)
RUN npm install -g vite sonarqube-scanner dotenv

# working directory
WORKDIR /workspace

# ensure terminal displays Turkish characters correctly when the container starts
ENV LANG=C.UTF-8
