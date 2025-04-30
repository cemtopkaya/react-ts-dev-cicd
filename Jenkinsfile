pipeline {
    agent any

    parameters {
        string(name: 'SQ_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SQ_CRED_ID', defaultValue: 'jenkins-sonar', description: 'SonarQube credential')
        string(name: 'SQ_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SQ_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        SONAR_SCANNER_OPTS = '-Xmx1024m'
    }

    stages {
        stage('SonarQube scan by Docker') {
            steps {
                script {
                    withSonarQubeEnv('local-sonar') {
                        sh """
                            chmod 777 -R .scannerwork
                            docker run --rm \
                                -u 1000:1000 \
                                --network=devnet \
                                -v .:/usr/src \
                                -v ./.scannerwork:/tmp/.scannerwork \
                                -w /usr/src \
                                sonarsource/sonar-scanner-cli \
                                sonar-scanner \
                                -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \
                                -Dsonar.projectName='${params.SQ_PROJECT_NAME}' \
                                -Dsonar.sources=. \
                                -Dsonar.working.directory='/usr/src/.scannerwork' \
                                -Dsonar.host.url=\${SONAR_HOST_URL} \
                                -Dsonar.token=\${SONAR_AUTH_TOKEN} \
                                -Dsonar.scm.disabled=true
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}