FROM node:8.12
ENV LAST_UPDATED 20190307T170200

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install

# data volume
VOLUME /backend/.tmp
# Expose API port to the outside
ENV PORT 80
EXPOSE 80

# Launch application
CMD ["npm","start"]