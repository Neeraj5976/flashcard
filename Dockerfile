FROM cypress/base:latest

WORKDIR /app

# Install OS-level dependencies for Cypress
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    libxrandr2 \
    xdg-utils \
    wget \
    lsb-release \
    dbus-x11 \
    x11-utils

# Copy project and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Install Cypress and wait-on globally
RUN npm install -g cypress wait-on

# Set display for xvfb
ENV DISPLAY=:99

# Make run.sh executable and expose port
COPY run.sh .
RUN chmod +x run.sh
EXPOSE 3001

CMD ["sh", "run.sh"]
