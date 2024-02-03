FROM node:18-alpine

WORKDIR /app/backend

COPY package.json yarn.lock /app/backend/

RUN yarn install --pure-lockfile

COPY . .

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "src/index.js"]
