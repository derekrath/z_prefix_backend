FROM node:16-alpine

# RUN mkdir -p /src/app

WORKDIR /server

COPY . /server

EXPOSE 3001

EXPOSE 3000

# //remove for production (dont expose to public)
EXPOSE 5432

RUN rm -f node_modules

RUN npm install

# delete on production
RUN npm install -g nodemon

# RUN apk add --no-cache make gcc g++ python && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python

CMD npm start