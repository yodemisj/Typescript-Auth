FROM node:22.12.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]