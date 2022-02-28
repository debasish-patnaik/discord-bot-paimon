FROM node:16

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY .env.production .env
COPY . .

RUN npm run build
RUN npx prisma generate

CMD ["npm", "run", "start"]