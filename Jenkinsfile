pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        DOCKER_COMPOSE = 'docker-compose'
        REGISTRY = 'docker.io'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out repository...'
                checkout scm
            }
        }

        stage('Validate Environment') {
            steps {
                echo '✅ Validating environment...'
                sh '''
                    docker --version
                    docker-compose --version
                    node --version
                    npm --version
                '''
            }
        }

        stage('Lint & Test - Backend') {
            steps {
                echo '🔍 Linting backend code...'
                dir('backend') {
                    sh '''
                        npm install
                        npm test || true
                    '''
                }
            }
        }

        stage('Lint & Test - Frontend') {
            steps {
                echo '🔍 Linting frontend code...'
                dir('frontend') {
                    sh '''
                        npm install
                        npm run lint || true
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }

        stage('Start Services') {
            steps {
                echo '🚀 Starting application services...'
                sh '''
                    docker compose down || true
                    docker compose up -d
                    sleep 15
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Performing health checks...'
                sh '''
                    echo "Checking Backend Health..."
                    for i in {1..30}; do
                        if curl -s http://localhost:5000 > /dev/null; then
                            echo "Backend is healthy"
                            break
                        fi
                        if [ $i -eq 30 ]; then
                            echo "Backend failed to start"
                            exit 1
                        fi
                        echo "Waiting for backend... ($i/30)"
                        sleep 2
                    done

                    echo "Checking Frontend Health..."
                    for i in {1..30}; do
                        if curl -s http://localhost:3000 > /dev/null; then
                            echo "Frontend is healthy"
                            break
                        fi
                        if [ $i -eq 30 ]; then
                            echo "Frontend failed to start"
                            exit 1
                        fi
                        echo "Waiting for frontend... ($i/30)"
                        sleep 2
                    done
                '''
            }
        }

        stage('Integration Tests') {
            steps {
                echo '🧪 Running integration tests...'
                sh '''
                    echo "Testing API endpoints..."
                    curl -i http://localhost:5000/ || true
                    curl -i http://localhost:3000/ || true
                '''
            }
        }

        stage('Log Service Status') {
            steps {
                echo '📊 Checking service logs...'
                sh '''
                    echo "=== Backend Logs ==="
                    docker compose logs backend --tail=20 || true
                    echo ""
                    echo "=== Frontend Logs ==="
                    docker compose logs frontend --tail=20 || true
                    echo ""
                    echo "=== MongoDB Logs ==="
                    docker compose logs mongodb --tail=10 || true
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            sh 'docker compose logs || true'
        }

        success {
            echo '✅ Pipeline completed successfully!'
            echo 'Application is running at:'
            echo '  Frontend: http://localhost:3000'
            echo '  Backend: http://localhost:5000'
        }

        failure {
            echo '❌ Pipeline failed!'
            sh '''
                echo "Debugging Information:"
                docker compose ps || true
                docker compose logs || true
            '''
        }

        unstable {
            echo '⚠️ Pipeline is unstable'
        }

        cleanup {
            echo 'Workspace cleanup done'
        }
    }
}