pipeline {
    agent any

    tools {
        nodejs "NodeJS" 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Install & Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            githubNotify context: 'ci/jenkins', description: 'Build passed', status: 'SUCCESS'
        }
        failure {
            githubNotify context: 'ci/jenkins', description: 'Build failed', status: 'FAILURE'
        }
    }
}