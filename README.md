# BS3206 Summative Assignment (Team AVBA)

## Development environment instructions:

Once the project repository is cloned on your machine, you should open two terminals in the **main folder directory** (you can do this in VS Code). One will run the node.js server, and one will run the main site (the react app client).

**In Order:**
### Terminal 1 (Server):
#### 1. Enter the server directory
```
cd server
```
#### 2. Start the node server
```
node index.js
```

You should now see `Server listening on port 8080` in your terminal feed.

### Terminal 2 (Client)
#### 1. Enter the client directory
```
cd client
```
#### 2. Start the node server
```
npm run start
```
Wait a moment, and once the process completes you will see a screen that looks like the following:
> Compiled successfully!
>
> You can now view client in the browser.
>
> Local:            http://localhost:3000

A browser window will also open containing the homepage. If you want to test the API Call button in the center, you can open the Developer menu in your browser by pressing either:
- <kbd>F12</kbd> 
or
- <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>J</kbd>  (Windows)
- <kbd>⌘ CMD</kbd> + <kbd>OPTION</kbd> + <kbd>J</kbd>  (Mac)

With the Developer menu open and the console shown, you can see the data object appearing once the API Call button is pressed.
