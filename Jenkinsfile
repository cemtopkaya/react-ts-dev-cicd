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
                        sh '''
                            rm -rf .scannerwork
                            mkdir -p .scannerwork
                            chmod 777 .scannerwork
                        '''

                        sh """
                            docker run \
                                --user root \
                                --network=devnet \
                                -v ".:/usr/src" \
                                -w /usr/src \
                                sonarsource/sonar-scanner-cli \
                                sonar-scanner \
                                -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \
                                -Dsonar.projectName='${params.SQ_PROJECT_NAME}' \
                                -Dsonar.sources=. \
                                -Dsonar.working.directory=/usr/src/.scannerwork \
                                -Dsonar.scanner.report.export.path=/opt/sonar-report \
                                -Dsonar.host.url=\${SONAR_HOST_URL} \
                                -Dsonar.token=\${SONAR_AUTH_TOKEN} \
                                -Dsonar.scm.disabled=true
                        """

                        sh """
                            docker exec -it pwd
                            docker exec -it sq ls -al 
                            # docker cp sq:/opt/sonar-report .scannerwork/
                            # docker rm -f sq
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