pipeline {
    agent any

    parameters {
        string(name: 'SQ_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SQ_CRED_ID', defaultValue: 'jenkins-sonar', description: 'SonarQube credential')
        string(name: 'SQ_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SQ_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        SONAR_SCANNER_OPTS = "-Xmx1024m"
    }

    stages {
        stage('SonarQube scan by Docker') {
            steps {
                script {
                    withSonarQubeEnv(credentialsId: "${params.SQ_CRED_ID}") {
                        docker.image('sonarsource/sonar-scanner-cli').inside("-v ${env.WORKSPACE}:/usr/src") {
                            sh """
                                sonar-scanner \\
                                -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \\
                                -Dsonar.projectName='${params.SQ_PROJECT_NAME}' \\
                                -Dsonar.sources=. \\
                                -Dsonar.host.url=${params.SQ_URL} \\
                                -Dsonar.login=${SONAR_AUTH_TOKEN} \\
                                -Dsonar.scm.disabled=true
                            """
                        }
                    }
                }
            }
        }
    }
}