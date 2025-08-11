.PHONY: help install dev build up down logs clean test lint format

# Default target
help:
	@echo "🚀 Cuchu - Comandos de desarrollo disponibles:"
	@echo ""
	@echo "📦 Instalación:"
	@echo "  install     Instalar dependencias del backend y frontend"
	@echo "  setup       Configurar entorno de desarrollo completo"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  up          Iniciar servicios con Docker Compose"
	@echo "  down        Detener servicios"
	@echo "  build       Reconstruir y iniciar servicios"
	@echo "  logs        Ver logs de los servicios"
	@echo ""
	@echo "🔧 Desarrollo:"
	@echo "  dev         Iniciar modo desarrollo (sin Docker)"
	@echo "  test        Ejecutar tests"
	@echo "  lint        Verificar código con ESLint"
	@echo "  format      Formatear código con Prettier"
	@echo ""
	@echo "🧹 Limpieza:"
	@echo "  clean       Limpiar archivos temporales y node_modules"
	@echo "  reset       Reset completo del entorno"

# Instalación de dependencias
install:
	@echo "📦 Instalando dependencias del backend..."
	cd backend && npm install
	@echo "📦 Instalando dependencias del frontend..."
	cd frontend && npm install
	@echo "✅ Dependencias instaladas"

# Configuración del entorno
setup:
	@echo "🚀 Configurando entorno de desarrollo..."
	@chmod +x scripts/dev-setup.sh
	@./scripts/dev-setup.sh

# Docker Compose
up:
	@echo "🐳 Iniciando servicios..."
	docker-compose up -d
	@echo "✅ Servicios iniciados"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:5000"
	@echo "🗄️  MongoDB Express: http://localhost:8081"
	@echo "🔴 Redis Commander: http://localhost:8082"

down:
	@echo "🛑 Deteniendo servicios..."
	docker-compose down
	@echo "✅ Servicios detenidos"

build:
	@echo "🔨 Reconstruyendo servicios..."
	docker-compose up -d --build
	@echo "✅ Servicios reconstruidos e iniciados"

logs:
	@echo "📋 Mostrando logs..."
	docker-compose logs -f

# Desarrollo local (sin Docker)
dev:
	@echo "🔧 Iniciando modo desarrollo..."
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:5000"
	@echo "💡 Presiona Ctrl+C para detener"
	@concurrently \
		"cd backend && npm run dev" \
		"cd frontend && npm run dev"

# Tests
test:
	@echo "🧪 Ejecutando tests..."
	cd backend && npm test
	cd frontend && npm test

# Linting
lint:
	@echo "🔍 Verificando código..."
	cd backend && npm run lint
	cd frontend && npm run lint

# Formateo
format:
	@echo "✨ Formateando código..."
	cd backend && npm run format
	cd frontend && npm run format

# Limpieza
clean:
	@echo "🧹 Limpiando archivos temporales..."
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
	rm -rf logs/*
	docker-compose down -v
	@echo "✅ Limpieza completada"

# Reset completo
reset: clean
	@echo "🔄 Reseteando entorno..."
	docker system prune -f
	docker volume prune -f
	@echo "✅ Reset completado"

# Verificar estado
status:
	@echo "📊 Estado de los servicios:"
	docker-compose ps
	@echo ""
	@echo "💾 Uso de recursos:"
	docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Backup de base de datos
backup:
	@echo "💾 Creando backup de la base de datos..."
	@mkdir -p backups
	docker exec cuchu_mongodb mongodump --db cuchu --out /data/backup
	docker cp cuchu_mongodb:/data/backup backups/$(shell date +%Y%m%d_%H%M%S)
	@echo "✅ Backup creado en backups/"

# Restaurar base de datos
restore:
	@echo "🔄 Restaurando base de datos..."
	@if [ -z "$(file)" ]; then \
		echo "❌ Especifica el archivo de backup: make restore file=backups/YYYYMMDD_HHMMSS"; \
		exit 1; \
	fi
	docker cp $(file) cuchu_mongodb:/data/restore
	docker exec cuchu_mongodb mongorestore --db cuchu /data/restore/cuchu
	@echo "✅ Base de datos restaurada"
