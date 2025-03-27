# Makefile
PROJECT_DIR := devadory

.PHONY: all
all: install dev

.PHONY: install
install:
	@echo "Installing dependencies..."
	@cd $(PROJECT_DIR) && npm install

.PHONY: dev
dev:
	@echo "Starting development server..."
	@cd $(PROJECT_DIR) && npm run dev

.PHONY: clean
clean:
	@echo "Cleaning up..."
	@cd $(PROJECT_DIR) && rm -rf node_modules .next

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start the development server"
	@echo "  make clean    - Remove node_modules and .next"
	@echo "  make help     - Show this help message"
