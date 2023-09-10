# Ecommerce Pet's shop project

## Technologies:
## Frontend:
1. DDD (Domain Driven Design)
2. React
3. TypeScript
4. Redux, Redux-toolkit, Redux-thunk
5. Material UI (components, themes)
6. i18n (en/ru)
7. Axios
8. .env
9. Jest tests
10. Service worker
11. Lazy loading

## Backend:
1. DDD (Domain Driven Design)
2. PostgresQL
3. MicroOrm
4. Migrations
5. Event emitter
6. Redis
7. Docker
8. .env
9. JWT Auth (Passport JS): Access and Refresh Token
10. I18N (EN, RU)
11. Swagger
12. Jest tests
13. Foreign keys
14. Local storage

## Database schema:
![image](https://github.com/Our-shop/shop-backend/assets/46794308/edb8b6cc-46e6-485b-ad1c-87074298305f)

## Description of functionality:
1. Authentication (Sign-in, Sign up)
2. Forget password, reset password
3. Protected routs for cart and user profile
4. Store overview of products
5. Search of products
6. Products filters by categories and products sorting
7. Page overview for product item
8. Cart interaction (add/remove item)
9. Purchasing from cart
10. Purchase history in user profile
11. Add, edit, delete operations for addresses in user profile
12. Overwiew of user addresses
13. Edit user name and email
14. Delete account functionality
15. Translation EN-RU
16. Error boundary page
17. Lazy loading
18. Jest Tests

# To run the App:

## Backend:

1. Clone git shop-backend repository to your local machine.
2. Open terminal in root directory of the application.
3. `npm install`
4. Ensure that ports 8000, 8080, 5432, 6379 and 5000 are free on your machine.
5. Enter command 'docker-compose up' in the terminal.
6. Once installation complete check if 3 containers started in docker desktop app.
7. Follow link http://localhost:8080 to be able to open PgAdmin
8. PgAdmin credentials: email: admin@gmail.com password: postgres
9. Your should see added server with initial migrations
10. Once you don't see server create new one: POSTGRES_USER: postgres, POSTGRES_PASSWORD: postgres
11. Your should find preinstalled initial migrations for user roles and products
12. Check if you have initial migrations in DB.
    10 In case you don't find initial migrations you can add initial roles for "user" and "admin" in Swager by link http://localhost:5000/swagger
13. Also add products if necessary
14. Run back: 'npm run start:dev'

## Frontend:

1. Clone git shop-frontend-client repository to your local machine.
2. Open terminal in root directory of the application.
3. `npm install`
4. Run front: `npm start`

Enjoy our work ! :)
