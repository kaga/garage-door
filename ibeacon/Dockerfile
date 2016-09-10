FROM hypriot/rpi-node

#RUN npm install -g typescript typings tslint

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --production

CMD ["npm", "start"]

