FROM node

COPY . /home/gatorchat/

WORKDIR /home/gatorchat

RUN npm install --production

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "http"]
