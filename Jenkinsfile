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

        stage('SonarQube scan') {
            steps {
                script {
                    /*
                        İster withSonarQubeEnv ile SonarQube sunucu bilgilerini environment değişkenlerine inject edin,
                        ister .env.cicd dosyasını kullanın,
                        ister Jenkins stage environment kısmında environment değişkenlerini tanımlayın
                        +
                        sonar-cicd.properties dosyasının bilgilerini de scanner'a inject edin.
                    */
                    sh """
                        echo -----------------------
                        printenv | grep SONAR
                        echo -----------------------
                    """

                    // İster yapılandırma aracınızı kullanarak çağırın:
                    sh 'npm run sonar:cicd'

                    timeout(time: 1, unit: 'HOURS') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
    }
}
