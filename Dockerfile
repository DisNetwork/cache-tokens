FROM node:v8 AS build_src
RUN npm install -g typescript
WORKDIR /app
ADD package*.json /app/
RUN npm install
ADD . /app
RUN tsc -p .
RUN npm remove -g typescript

FROM node:alpine
COPY --from=build_src /app/node_modules /app/node_modules
COPY --from=build_src /app/out /app/out
WORKDIR /app
CMD node out/index
