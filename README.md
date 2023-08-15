# shop-backend

Backend
1. migrations
2. I18N (EN, RU)
3. Jest tests (75% coverage)
4. DDD (Domain Driven Design)
5. MicroOrm
6. PostgresQL
7. Event Emitter
8. JWT Auth (Passport JS): Access and Refresh Token
9. Redis
10. Foreign keys
11. Service worker
12. Websocket (Socket IO, Socket JS): for updating of status orders - Optional

Assign tasks with usage of Trello

# Rules for work in GIT on Development stage:  
**For adding new functionality**
1. Clone the repository: 
*git clone git@github.com:Our-shop/shop-backend.git*
2. Checkout to the **Development** branch:  
2.1. *git branch* - (check if development branch exists)
You should see at least **main** and **development** branches.  
2.2. *git checkout development*
3. Create new branch for your current task (e.g. your task is *US-07: "add smth"*) with task ID name:  
git branch US-07
4. Add your logic for task.
5. Commit every change to the task repository adding task ID as a tag in the beginning of each commit for this task logic:  
5.1. *Git add .*  
5.2. *Git commit -m "US-07: add smth"*
6. Push your work into the repository:  
*Git push origin main*
