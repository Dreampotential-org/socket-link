FROM alpine AS code

ARG DIR_APP

COPY ${DIR_APP} /app



FROM node:14.17 AS node-build

WORKDIR /app

COPY --from=code /app .

RUN npm install 

# RUN npm run build

# RUN npm install -g serve

# CMD ["serve", "-s", "build", "-l", "8000"]
CMD [ "yarn", "dev" ]
