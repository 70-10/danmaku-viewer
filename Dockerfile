FROM node:8-alpine

COPY . /workspace
WORKDIR /workspace

RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
