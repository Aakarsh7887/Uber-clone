pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/Aakarsh7887/Uber-clone.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker-compose up -d'
            }
        }

    }
}