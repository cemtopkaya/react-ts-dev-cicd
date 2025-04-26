pipeline {
    agent any

    params {
        string(name: 'GIT_URL', defaultValue: '.....', description: 'Git repository URL')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Git branch to build')
        string(name: 'GIT_CREDENTIALS_ID', defaultValue: 'jenkins-git-credentials', description: 'Git credentials ID')
        string(name: 'DOCKER_CREDENTIALS_ID', defaultValue: 'jenkins-docker-cred', description: 'Docker credential')
        string(name: 'SONARQUBE_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SONARQUBE_CREDENTIALS_ID', defaultValue: 'sonarqube-cred', description: 'SonarQube credential')
        string(name: 'SONARQUBE_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SONARQUBE_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        DOCKER_CREDENTIALS_ID = credentials("${DOCKER_CREDENTIALS_ID}")
        SONARQUBE_CREDENTIALS_ID = credentials("${SONARQUBE_CREDENTIALS_ID}")
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    git branch: 'main', url: '${GIT_URL}' // Replace with your Git repository URL
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
                            script: 'curl -s https://sonar.telenity.com/api/qualitygates/project_status?projectKey=react-diff',
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
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        cd release
                        docker build -t telenity/admin-portal:1.1.1 .
                        docker push telenity/admin-portal:1.1.1
                    '''
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
