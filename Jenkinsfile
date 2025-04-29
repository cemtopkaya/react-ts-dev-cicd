pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.build'
            dir '.devcontainer'
            label 'master-jenkins'
            additionalBuildArgs  '--build-arg version=1.0.2'
            args '-v /tmp:/tmp'
        }
    }

    options {
        // Otomatik checkout istemiyorsak yani elle checkout yapacaksak skipDefaultCheckout(true)
        // Otomatik checkout yapılacaksa yani (Pipeline script from SCM/Multibranch ise) skipDefaultCheckout(true),
        skipDefaultCheckout(false)
    }

    parameters {
        separator(name: 'GIT SETTTINGS')
        string(name: 'GIT_URL', defaultValue: 'https://github.com/cemtopkaya/react-ts-dev-cicd.git', description: 'Git URL')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Main branch of repository')
        string(name: 'GIT_SOURCE_BRANCH', defaultValue: 'feature/jenkins', description: 'Source branch to merge from')
        string(name: 'GIT_TARGET_BRANCH', defaultValue: 'main', description: 'Target branch to merge into')
        string(name: 'GIT_CREDENTIALS_ID', defaultValue: 'jenkins-git-credentials', description: 'Git credentials ID')

        separator(name: 'DOCKER SETTTINGS')
        string(name: 'DOCKER_CREDENTIALS_ID', defaultValue: 'jenkins-docker-cred', description: 'Docker credential')
        string(name: 'DOCKER_IMAGE', defaultValue: 'telenity/admin-portal:1.1.1', description: 'Docker image name')
        string(name: 'DOCKER_REGISTRY', defaultValue: 'docker.telenity.com', description: 'Docker registry URL')

        separator(name: 'SONARQUBE SETTTINGS')
        string(name: 'SONAR_URL', defaultValue: 'http://sonar.telenity.com', description: 'SonarQube server URL')
        string(name: 'SONAR_CREDENTIALS_ID', defaultValue: 'jenkins-sonar', description: 'SonarQube credential')
        string(name: 'SONAR_PROJECT_KEY', defaultValue: 'react-diff', description: 'SonarQube project key')
        string(name: 'SONAR_PROJECT_NAME', defaultValue: 'React Diff', description: 'SonarQube project name')
    }

    environment {
        // DOCKER_CREDENTIALS_ID = credentials("${DOCKER_CREDENTIALS_ID}")
        GIT_URL = "${params.GIT_URL}"
        GIT_BRANCH = "${params.GIT_BRANCH}"
        GIT_CREDENTIALS_ID = "${params.GIT_CREDENTIALS_ID}"
        DOCKER_CREDENTIALS_ID = "${params.DOCKER_CREDENTIALS_ID}"
        SONAR_URL = "${params.SONAR_URL}"
        SONAR_CREDENTIAL = credentials("${params.SONAR_CREDENTIALS_ID}")
        SONAR_CREDENTIALS_ID = "${params.SONAR_CREDENTIALS_ID}"
        SONAR_PROJECT_KEY = "${params.SONAR_PROJECT_KEY}"
        SONAR_PROJECT_NAME = "${params.SONAR_PROJECT_NAME}"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout Code') {
            steps {
                echo "Checkout yapılıyor: ${env.GIT_URL} - ${env.GIT_BRANCH ?: 'main'}"
                git url: "${env.GIT_URL}", branch: "${env.GIT_BRANCH}"
                // git url: "${env.GIT_URL}", branch: "${env.GIT_BRANCH}", credentialsId: "${env.GIT_CREDENTIALS_ID}"
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'pwd'
                    sh 'ls -al'
                    sh 'npm run build'
                }
            }
        }
        stage('SonarQube Analysis using sonar-scanner cli ') {
            environment {
                SONAR_HOST_URL = "${SONAR_URL}"
                SONAR_PROJECT_KEY = "${SONAR_PROJECT_KEY}"
                SONAR_PROJECT_NAME = "${SONAR_PROJECT_NAME}"
                SONAR_TOKEN = credentials("${SONAR_CREDENTIALS_ID}")
            }
            steps {
                script {
                    /*
                        SonarQube sunucusuna erişim için gerekli credential,
                        SonarQube sunucusunda (örn. http://sonar:9000) Administration->Security->Users
                        içinde bir token olarak tanımlanmalı ve bu token Jenkins'e credential olarak eklenmiş olmalı.
                    */
                    withCredentials([string(credentialsId: "${SONAR_CREDENTIALS_ID}", variable: 'SONAR_TOKEN')]) {
                        sh 'env'
                        sh 'npm run sonar:cicd'
                        def response = sh(
                            script: "curl -s https://${SONAR_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}",
                            returnStdout: true
                        ).trim()

                        def json = readJSON text: response
                        if (json.projectStatus.status == 'ERROR') {
                            error("SonarQube Quality Gate failed: status is ${json.projectStatus.status}")
                        }
                        
                        sh """
                            echo -----------------------
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.login=\${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        stage('SonarQube Analysis using Sonarqube Plugin in Jenkins') {
            steps {
                script {
                    /*
                        Jenkins sunucusunda Configuration->Sonarqube Server kısmında
                        "local-sonar" isimli SonarQube sunucusu tanımlanmış olmalı.
                        SonarQube sunucusuna erişim için gerekli credential,
                        SonarQube sunucusunda (örn. http://sonar:9000) Administration->Security->Users
                        içinde bir token olarak tanımlanmalı ve bu token Jenkins'e credential olarak eklenmiş olmalı.
                    */
                    withSonarQubeEnv('local-sonar') {
                        sh 'npm run sonar:cicd'
                        def response = sh(
                            script: "curl -s https://${SONAR_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}",
                            returnStdout: true
                        ).trim()
                        def json = readJSON text: response
                        if (json.projectStatus.status == 'ERROR') {
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

                        // --skip-update : "update database" ile uğraşmasın
                        // --severity HIGH,CRITICAL: sadece yüksek riskli açıklar gelsin
                        // --format json --output report.json: Raporu JSON formatında al
                        // --no-progress: Ekranda gereksiz loading barı çıkmasın
                        // --exit-code 1: Eğer hata bulursa exit 1 yapar ve Jenkins stage'ı FAIL olsun
                        def scanExitCode = sh(
                            script: """
                                trivy image \
                                --severity HIGH,CRITICAL \
                                --ignore-unfixed \
                                --no-progress \
                                --skip-update \
                                --exit-code 1 \
                                ${DOCKER_IMAGE}
                            """,
                            returnStatus: true // Return exit code but don't fail the build
                        )

                        // Raporu JSON formatında al ve ekrana yazdır (tee komutu ile)
                        sh "trivy image --format json ${DOCKER_IMAGE} | tee trivy-report.json"

                        if (scanExitCode != 0) {
                            error("Trivy scan failed with exit code ${scanExitCode}")
                        }

                        // Push Docker image to registry
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

        stage("konteyneri temizle") {
            steps {
                cleanWs()
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
