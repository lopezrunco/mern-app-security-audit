# API REST with Express framework

This project serves as the backbone for the CampoEventos web app, providing users with access to live-streamed livestock auctions and the ability to make pre-auction offers.

## Instructions

This project serves as the backbone for the CampoEventos web app, providing users with access to live-streamed livestock auctions and the ability to make pre-auction offers.

Create .env file with the environment variables

```bash
PORT=3000
JWT_KEY=5tj567trgh567456h
DB_HOST=clustername.abcdefg.mongodb.net
DB_PORT=27017
DB_NAME=dbname
DB_USER=username
DB_PASSWORD=password
```

```bash
# Install dependencies
npm i

# Insert test data
npm run seed

# Start API
npm start

# Run a global test
npm test

# Run a test in a specific file
npm test check-user-role.test.js
```
