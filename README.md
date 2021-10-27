## To run project :heart:
1. Install all packages are defined in package.json via command: `npm install`
2. Download **config.env** file in card *Cuối kì* on Trello, add this file to the root project folder
3. Redefine your localhost URL if it does not match the default
   - Open config.env
   - Rewrite URL at line 22: URL_TEST  
5. Run the server with given port via the command: `npm run dev`
6. Open another terminal to run TestCafe via: `npm run test`
