# Les Petits Plats

![artem-barinov_les-petits-plats_opt](https://github.com/user-attachments/assets/a12e41ef-6a35-4beb-9bd1-833bba4c7db0)


*This was project 7 out of 12 that I completed as part of the **OpenClassrooms JavaScript & React** course I took in 2023-2024.*

## About

* I was provided a Figma mockup and had to implement it using HTML and CSS.
* I was instructed to build all interactivity and functionality from scratch using only vanilla JavaScript. This meant manipulating the DOM directly with JavaScript via events.
* The recipe data was provided as an array of objects. Data had to be extracted, modeled, de-duplicated, and sorted.
* The code was structured using an OOP approach, leveraging JavaScript Classes. The code was organized into separate files and loaded as ESM modules.
* The search bar input performs validation to activate only on queries longer than 3 characters, and an error is shown when no matches are found.
* The search bar also performs basic input sanitization and ignores any special characters that match a regular expression. This is not the best solution in terms of UX because it silently ignores keystrokes inputting special characters, but this was not a requirement and I added this feature as a bonus.
* We were asked to write a search algorithm twice: once using JavaScript's native methods such as `Array.prototype.filter()`, `String.prototype.includes()`, etc., and then another time using basic `for` loops. We compared the performance of the two algorithms using jsben.ch and jsbench.me and learned that the algorithm using `for` loops is faster, but has a tradeoff that the code is less easy to read. The difference was minimal on our data set that contains only 50 recipes, but the difference would become progressively more significant the larger the data set in question.
* The most challenging part of the project, however, was ensuring that when several filters of different categories are selected, the results represent an _intersection_ of the selected filters.

Project specs:
* Platform: Desktop
* Languages used: HTML, CSS, JavaScript
* Timeline: 1 month
* Skills:
  * HTML and CSS implementation based on design mockup
  * OOP
  * Data modeling
  * DOM manipulation
  * Input validation
  * Searching, sorting, and filtering

## Try it!

### Live instance

You can try the app live [here](https://les-petits-plats.artembarinov.com/).

### Clone and serve

Alternatively, you can clone this repository and run the app locally:

* Clone [this repository](https://github.com/sensologica/les-petits-plats)
* Open the project in your text editor of choice (the rest of these instructions will assume [Visual Studio Code](https://code.visualstudio.com/))
* Install and run the [Live Preview extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) (This or an alternative web server extension is necessary to properly load JavaScript modules the app relies on)
* By default, the Live Preview extension will run the project at `http://127.0.0.1:3000/index.html`. Navigate to this address in your web browser to see the functional application

### What to try?

Here are some things you can try to test-drive the app:
- [ ] Make sure you view the app on a computer. The project brief did not require this app to be responsive so it is not optimized for viewing on mobile devices.
- [ ] Use the main search bar to search across all recipe descriptions. Try typing in "thon" (French for tuna) or "poulet" (French for chicken) to surface only the recipes that contain those words.
- [ ] The search bar performs some validation on the input. Try typing in fewer than 3 characters to see a corresponding error messsage. Or try typing something that is not a food such as "abcdef" to see an error message that appears when no results are found.
- [ ] Try typing in "<script>". You will see that the angle brackets were ignored as part of input sanitization.
- [ ] Below the main search bar you have 3 types of filters. The options in each filter are searchable. In the "Ingrédients" (ingredients) filter, type in "bana" and click on "Banana" to apply the filter. As you can see, the search is case-insensitive.
- [ ] You can combine filters to get an intersection of the results. In the "Ustensiles" (utensils) filter, choose "couteau" (knife). The results will update to only show those recipes that contain both banana as ingredient and knife as utensil.
- [ ] Remove the applied filters by clicking the "x" icons on the yellow tags under the filter bar. Alternatively, remove selected options from within each filter's options list. The search results will update accordingly.
- [ ] Note that as you search and filter recipes, the number to the right of the filters bar updates to show the number of matches.
