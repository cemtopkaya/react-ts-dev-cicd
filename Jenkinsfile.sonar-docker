/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.build'
            dir '.devcontainer'
            label 'master-jenkins'
            additionalBuildArgs  '--build-arg version=1.0.2'
            args '-v /tmp:/tmp -v /var/run/docker.sock:/var/run/docker.sock --network=devnet'
        }
    }

    options {
        // Otomatik checkout istemiyorsak yani elle checkout yapacaksak skipDefaultCheckout(true)
        // Otomatik checkout yapılacaksa yani (Pipeline script from SCM/Multibranch ise) skipDefaultCheckout(true),
        skipDefaultCheckout(false)
    }

    parameters {
        separator(name: 'git_settings', sectionHeader: 'GIT SETTTINGS')
        string(name: 'GIT_URL', defaultValue: 'https://github.com/cemtopkaya/react-ts-dev-cicd.git', description: 'Git URL')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Main branch of repository')
        string(name: 'GIT_SOURCE_BRANCH', defaultValue: 'feature/jenkins', description: 'Source branch to merge from')
        string(name: 'GIT_TARGET_BRANCH', defaultValue: 'main', description: 'Target branch to merge into')
        string(name: 'GIT_CRED_ID', defaultValue: '', description: 'Git credentials ID')

        separator(name: 'docker_settings', sectionHeader: 'DOCKER SETTTINGS')
        string(name: 'DOCKER_CRED_ID', defaultValue: 'jenkins-docker-cred', description: 'Docker credential')
        string(name: 'DOCKER_IMAGE', defaultValue: 'telenity/admin-portal:1.1.1', description: 'Docker image name')
        string(name: 'DOCKER_REGISTRY', defaultValue: 'docker.telenity.com', description: 'Docker registry URL')

        separator(name: 'sonarqube_settings', sectionHeader: 'SonarQube SETTTINGS')
        string(name: 'SQ_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SQ_CRED_ID', defaultValue: 'jenkins-sonar', description: 'SonarQube credential')
        string(name: 'SQ_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SQ_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        GIT_URL = "${params.GIT_URL}"
        GIT_BRANCH = "${params.GIT_BRANCH}"
    }

    // tools {
    //     sonarQubeScanner 'SonarQube Scanner 4.8.0.2856'
    // }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                script {
                    echo "Checking out from ${env.GIT_URL} on branch ${env.GIT_BRANCH}"

                    // Option 1: Use the git step (simpler)
                    if (params.GIT_CRED_ID?.trim()) {
                        git(
                            url: env.GIT_URL,
                            branch: env.GIT_BRANCH,
                            credentialsId: params.GIT_CRED_ID
                        )
                    } else {
                        git(
                            url: env.GIT_URL,
                            branch: env.GIT_BRANCH
                        )
                    }
                }
            }
        }

        stage('SonarQube scan by Docker') {
            environment {
                SONAR_SCANNER_OPTS = "-Xmx1024m"
            }
            steps {
                script {
                    withSonarQubeEnv('local-sonar') {
                        /*
                        SONAR_USER_HOME=/opt/sonar-scanner/.sonar
                        SONAR_CONFIG_NAME=local-sonar
                        SONAR_EXTRA_PROPS=-X
                        SONAR_AUTH_TOKEN=******
                        SONAR_MAVEN_GOAL=sonar:sonar
                        SONAR_SCANNER_OPTS=-Xmx1024m
                        SONAR_HOST_URL=http://sonar:9000
                        SONAR_SCANNER_HOME=/opt/sonar-scanner
                        */
                        docker
                            .image('sonarsource/sonar-scanner-cli')
                            .inside("--network=devnet -v ${WORKSPACE}:/usr/src") {
                                sh """
                                    sonar-scanner \
                                    -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \
                                    -Dsonar.projectName='${params.SQ_PROJECT_NAME}' \
                                    -Dsonar.projectBaseDir=. \
                                    -Dsonar.sources=. \
                                    -Dproject.settings=./sonar-cicd.properties \
                                    -Dsonar.host.url=\${SONAR_HOST_URL} \
                                    -Dsonar.token=\${SONAR_AUTH_TOKEN} \
                                    -Dsonar.scm.disabled=true
                                """
                            }
                    }

                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
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
            // cleanWs()

        // cleanWs(cleanWhenNotBuilt: false,
        //         deleteDirs: true,
        //         disableDeferredWipeout: true,
        //         notFailBuild: true,
        //         patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
        //                    [pattern: '.propsfile', type: 'EXCLUDE']])
        }
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}
