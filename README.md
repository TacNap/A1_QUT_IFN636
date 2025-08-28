# Budget Tracker Application
###### Matthew Little - n10756850

### About
This is a basic budget tracking platform.
Users can register, login and begin entering their recent transactions and income.
They can then create new Budgets with assigned categories. 

The app will automatically sort transactions into their respective budgets, 
and determine how much is remaining to be spent in that category. 

### Live URL
You can access the live platform [Here](http://13.211.207.160/).

### Running the project
In order to run the project locally:
1. Rename `backend/.env.example` to `backend/.env` - you won't need to change its contents
2. Go to `frontend/src/axiosConfig.jsx` and switch from th Live URL to Local URL:
Change this
```
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://3.26.216.93:5001', // live
  headers: { 'Content-Type': 'application/json' },
});
```
To this
```
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.26.216.93:5001', // live
  headers: { 'Content-Type': 'application/json' },
});
```
3. run `npm run dev` and view the application in the browser.

### Credentials
If you don't want to register a new account, you can use the test account:
Email: `user@gmail.com`
Password: `password01`
