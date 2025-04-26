pipeline {
    agent any

    params {
        separator(name: "GIT SETTTINGS")
        string(name: 'GIT_URL', defaultValue: '.....', description: 'Git repository URL')
        string(name: 'GIT_SOURCE_BRANCH', defaultValue: 'feature/jenkins', description: 'Source branch to merge from')
        string(name: 'GIT_TARGET_BRANCH', defaultValue: 'main', description: 'Target branch to merge into')
        string(name: 'GIT_CREDENTIALS_ID', defaultValue: 'jenkins-git-credentials', description: 'Git credentials ID')

        separator(name: "DOCKER SETTTINGS")
        string(name: 'DOCKER_CREDENTIALS_ID', defaultValue: 'jenkins-docker-cred', description: 'Docker credential')
        string(name: 'DOCKER_IMAGE', defaultValue: 'telenity/admin-portal:1.1.1', description: 'Docker image name')
        string(name: 'DOCKER_REGISTRY', defaultValue: 'docker.telenity.com', description: 'Docker registry URL')

        separator(name: "SONARQUBE SETTTINGS")
        string(name: 'SONAR_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SONAR_CREDENTIALS_ID', defaultValue: 'sonarqube-cred', description: 'SonarQube credential')
        string(name: 'SONAR_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SONAR_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        DOCKER_CREDENTIALS_ID = credentials("${DOCKER_CREDENTIALS_ID}")
        SONAR_CREDENTIALS_ID = credentials("${SONAR_CREDENTIALS_ID}")
    }

    stages {
        agent {
            // Equivalent to "docker build -f Dockerfile.build --build-arg version=1.0.2 ./build/
            dockerfile {
                filename 'Dockerfile.build'
                dir '.devcontainer'
                label 'react-build-docker'
                additionalBuildArgs  '--build-arg version=1.0.2'
                args '-v /tmp:/tmp'
            }
        }
        stage('Preparation') {
            steps {
                script {
                    // Clean workspace
                    cleanWs()
                    // Checkout code
                    checkout scm
                }
            }
        }
        stage('Clone Repository') {
            steps {
                script {
                    git branch: "${GIT_SOURCE_BRANCH}", url: "${GIT_URL}"
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') { // Replace 'SonarQube' with your SonarQube server name
                        sh 'npm run sonar:cicd'
                        def response = sh(
                            script: "curl -s https://${SONAR_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}",
                            returnStdout: true
                        ).trim()
                        def json = readJSON text: response
                        if (json.projectStatus.status != 'ERROR') {
                            error("SonarQube Quality Gate failed: status is ${json.projectStatus.status}")
                        }
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    sh 'npm run test:run:coverage'
                }
            }
        }
        stage('Coverage Check') {
            steps {
                script {
                    sh 'npm run coverage:newcode'
                }
            }
        }
        stage('Build-Scan-Push Docker Image') {
            steps {
                // Docker build 
                // Trivia: https://www.jenkins.io/doc/book/pipeline/syntax/#docker 
                // and push
                script {
                    dir("${WORKSPACE}/release") {
                        sh "docker build -t ${DOCKER_IMAGE} ."
                        // Trivy taraması yapılacak
                        // sh 'trivy image --exit-code 1 --severity CRITICAL,HIGH,MEDIUM,LOW \
                        // --ignore-unfixed --no-progress --quiet ${DOCKER_IMAGE}'
                        docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                            sh "docker push ${DOCKER_IMAGE}"
                        }
                    }
                }
            }
        }
        stage('Merge to Main') {
            steps {
                script {
                    sh """
                        git config --global user.email ""
                        git config --global user.name "Jenkins"
                        git checkout -b ${GIT_TARGET_BRANCH}
                        git merge --no-ff ${GIT_SOURCE_BRANCH}
                    """
                }
            }
        }
    }
    // Buraya tekrar bakılacak: https://www.jenkins.io/doc/book/pipeline/syntax/#post-conditions
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Cleaning up...'
            sh 'docker rmi telenity/admin-portal:1.1.1 || true'
        }
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}
