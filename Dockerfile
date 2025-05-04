FROM node:22

COPY . /blog

# Copy GitHub secrets
COPY .env /blog/backend

WORKDIR /blog/frontend
RUN npm install
RUN npm run build

RUN mkdir -p /blog/public && cp -r ./dist/radio-repeater-blog/browser/* /blog/public

WORKDIR /blog/backend
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
