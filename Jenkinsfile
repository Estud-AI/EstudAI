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
            echo '✅ Pipeline executada com sucesso!'
        }
        failure {
            echo '❌ Pipeline falhou, não será aceito.'
        }
    }
}