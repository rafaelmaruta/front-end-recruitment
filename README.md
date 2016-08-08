# Netshoes Cart Test

## Expected result

* See a list of products;
Done
* Be able to add or remove items to the cart and get instant visual feedback;
Done
* See the products added to the cart.
Done

## Data

The data we provide is a static JSON file under `/public/data`.
Done

## Notes

* You can use whatever stack or tooling you want to help you;
Used:
- Grunt as Task Runner
- Less as CSS pre-processor
- Flexbox Grid for responsive system grid
- Zepto as a basic lightweight JavaScript library
- React as Javascript Library for dynamic DOM manipulation

* Feel free to ask us questions during the process (but trust your guts, please!);
Not needed

* You should create a static server in order to access the JSON data provided.
Used the node module http-server

## Bonus

* Persist data on page reload;
Done with LocalStorage React module

* Test your code;

* Instructions on how to build/run the project.

1. Install Node.js: https://nodejs.org/eng/download/. During the instalation, please check if the "Adicionar npm ao PATH" option is enabled

2. Then install the Grunt client running at the terminal: npm install -g grunt-cli

3. Yet at the terminal: npm install jitsu -g

4. So navigate to the folder you want to install http-server (I installed in C:/inetpub)

5. Run: jitsu install http-server

6. And then to start the server: node bin/http-server

7. With Git, clone the project repository inside the public folder

8. With another terminal window (the first one is running the http-server), run npm install -d in the directory where are the Gruntfile.js and package.json to install the node modules dependences

9. After the node modules installing, run: 
   9.1 grunt w to watch the project
   9.2 grunt build to build all processable files
   9.3 grunt css to process Less files
   9.4 grunt js to minify the JavasScript files

10. Access the project via http://localhost:8080/front-end-recruitment. You can edit your host file like I did. I access via http://www.teste-maruta-netshoes.com.br:8080/front-end-recruitment/