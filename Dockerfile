FROM node:24-alpine

WORKDIR /app

# Включаем corepack и ставим pnpm (версию возьмёт из packageManager, если указан, иначе последнюю)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем файлы для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Ставим зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Порт Nuxt (по умолчанию 3000)
EXPOSE 3000

# Запускаем dev-сервер, слушаем все интерфейсы
CMD ["pnpm", "dev", "--host", "0.0.0.0"]