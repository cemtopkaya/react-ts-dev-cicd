pipeline {
    agent any

    stages {
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
                            script: "curl -s https://sonar.telenity.com/api/qualitygates/project_status?projectKey=react-diff",
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
                    sh 'npm run '
                }
            }
        }
        stage('Coverage Check') {
            steps {
                script {
                    sh 'npx diff-cover coverage/lcov.info --compare-branch=main'
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