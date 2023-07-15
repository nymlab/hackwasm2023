#  -------- Builder --------
FROM node:18-alpine as builder

# Install dependencies
COPY ../package.json .
COPY ../yarn.lock .
RUN yarn install --immutable --immutable-cache

# Copy project
COPY ../. .
RUN yarn build

# -------- END builder --------
FROM node:18-alpine

# Copy files
WORKDIR /app
COPY --from=builder /dist /app
COPY --from=builder /yarn.lock /app
COPY --from=builder /package.json /app

# Dependencies
RUN yarn install --immutable --immutable-cache

# Execute
CMD node ./src/server.js
# Port exposing
EXPOSE 8080

