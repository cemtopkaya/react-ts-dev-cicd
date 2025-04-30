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
                    echo "Checking out from ${env.GIT_URL} on branch ${env.GIT_BRANCH ?: 'main'}"
                    
                    def scmVars = checkout([
                        $class: 'GitSCM',
                        branches: [[name: env.GIT_BRANCH]],
                        extensions: [],
                        userRemoteConfigs: [[
                            url: env.GIT_URL,
                            credentialsId: params.GIT_CRED_ID?.trim() ? params.GIT_CRED_ID : null
                        ]]
                    ])
                }
            }
        }

        stage('SonarQube scan by Docker') {
            steps {
                script {
                    withSonarQubeEnv('local-sonar') {
                        docker.image('sonarsource/sonar-scanner-cli').inside("-v ${WORKSPACE}:/usr/src") {
                            sh """
                                sonar-scanner \
                                -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \
                                -Dsonar.projectName='${params.SQ_PROJECT_NAME}' \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=\${SONAR_HOST_URL} \
                                -Dsonar.login=\${SONAR_AUTH_TOKEN}
                            """
                        }
                    }
                }
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
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube scan') {
            // environment {
            //     SONAR_URL = "${params.SQ_URL}"
            //     SONAR_CREDENTIALS_ID = "${params.SQ_CRED_ID}"
            //     SONAR_PROJECT_KEY = "${params.SQ_PROJECT_KEY}"
            //     SONAR_PROJECT_NAME = "${params.SQ_PROJECT_NAME}"
            // }
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
                        /**
                            withSonarQubeEnv Fonksiyonu aşağıdaki değişkenleri ortam değişkenlerine enjecte eder:
                            SONAR_EXTRA_PROPS=-X
                            SONAR_MAVEN_GOAL=local-sonar
                            SONARQUBE_SCANNER_PARAMS={ "sonar.host.url" : "http:\/\/sonar:9000", "sonar.token" : "******"}
                            SONAR_AUTH_TOKEN=******
                            SONAR_CONFIG_NAME=local-sonar
                            SONAR_HOST_URL=http://sonar:9000
                        */

                        // İster yapılandırma aracınızı kullanarak çağırın:
                        // sh 'npm run sonar:cicd'

                        // İster sonar-scanner CLI aracını kullanarak çağırın:
                        sh """
                            echo -----------------------
                            echo SONAR_PROJECT_KEY: \$SONAR_PROJECT_KEY
                            echo SONAR_PROJECT_NAME: \$SONAR_PROJECT_NAME
                            echo SONAR_HOST_URL: \$SONAR_HOST_URL
                            echo SONAR_AUTH_TOKEN: \$SONAR_AUTH_TOKEN
                            echo SONAR_MAVEN_GOAL: \$SONAR_MAVEN_GOAL
                            echo SONARQUBE_SCANNER_PARAMS: \$SONARQUBE_SCANNER_PARAMS
                            echo SONAR_SCANNER_JSON_PARAMS: \$SONAR_SCANNER_JSON_PARAMS
                            echo SONAR_CONFIG_NAME: \$SONAR_CONFIG_NAME
                            echo -----------------------
                        """

                        sh """
                            sonar-scanner \
                            -Dsonar.projectKey=${params.SQ_PROJECT_KEY} \
                            -Dsonar.projectName=${params.SQ_PROJECT_NAME} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_AUTH_TOKEN}
                            echo !!
                        """
                    }
                }
            }
        }
        /*

                        def url = "curl -s -u ${SONAR_TOKEN}: ${SONAR_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                        def response = sh(
                            script: url,
                            returnStdout: true
                        ).trim()

                        echo "SonarQube Quality Gate status: ${url}"
                        echo "SonarQube response: ${response}"

                        if (response == null || response == '') {
                            error('SonarQube Quality Gate failed: response is null or empty')
                        }

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






                        def response = sh(
                            script: "curl -s -u ${SONAR_AUTH_TOKEN}: https://${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}",
                            returnStdout: true
                        ).trim()

                        echo "SonarQube Quality Gate status: ${url}"
                        echo "SonarQube response: ${response}"

                        if (response == null || response == '') {
                            error('SonarQube Quality Gate failed: response is null or empty')
                        }

                        try {
                            def json = readJSON text: response
                            if (json.projectStatus.status == 'ERROR') {
                                error("SonarQube Quality Gate failed: status is ${json.projectStatus.status}")
                            }
                        } catch (Exception e) {
                            error("SonarQube Quality Gate failed: response is not valid JSON. Error: ${e.getMessage()}\nResponse: ${response}")
                        }
    
        */
        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('SonarQube Analysis using sonar-scanner cli ') {
            // skip this stage
            when {
                expression { false }
            }
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
                        def url = "curl -s -u ${SONAR_TOKEN}: ${SONAR_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                        def response = sh(
                            script: url,
                            returnStdout: true
                        ).trim()

                        echo "SonarQube Quality Gate status: ${url}"
                        echo "SonarQube response: ${response}"

                        if (response == null || response == '') {
                            error('SonarQube Quality Gate failed: response is null or empty')
                        }

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
            environment {
                DOCKER_IMAGE = "${params.DOCKER_IMAGE}"
                DOCKER_REGISTRY = "${params.DOCKER_REGISTRY}"
                DOCKER_CREDENTIALS_ID = "${params.DOCKER_CRED_ID}"
            }
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
                        docker.withRegistry("https://${DOCKER_REGISTRY}", "${env.DOCKER_CREDENTIALS_ID}") {
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
                        git checkout -b ${params.GIT_TARGET_BRANCH}
                        git merge --no-ff ${params.GIT_SOURCE_BRANCH}
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
