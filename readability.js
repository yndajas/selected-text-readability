// readability alogithm
// TODO

// execute a script on the current tab
chrome.tabs.executeScript( {
    // get selected text and convert to a string
    code: "window.getSelection().toString();"
}, function(selection) { // pass in the return value of the code (the selected text) to a function as selection
    // trim leading and trailing spaces, replace new lines with spaces, then reduce any remaining consecutive spaces to single spaces
    var text = selection[0].trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g, ' ')

    // if there is selected text, run readability alogrithm and inject result
    if (text.length > 0) { // if not, provide usage instructions;
      // get reading level
      var reading_level = "TODO"

      // populate HTML main
      document.getElementsByTagName("main")[0].innerHTML =
        `
        <div class="accordion" id="accordion">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
                <button class="btn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <b class="text-dark">Reading level</b>
                </button>
              </h5>
            </div>
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
              <div id="reading-level" class="card-body"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingTwo">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <b class="text-dark">Text</b>
                </button>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
              <div id="text" class="card-body"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingThree">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <b class="text-dark">Method and limitations</b>
                </button>
              </h5>
            </div>
            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
              <div class="card-body">
                <p>The calculation is based on the <a href="https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index" target="_blank">Coleman-Liau index</a> and relies on counting letters, words and sentences.</p>

                <p><em>Letters</em> are the characters a-z/A-Z.</p>

                <p><em>Words</em> are calculated by counting the number of spaces, with one added to the total to account for the final word. The text is initially cleaned to remove double spacing and line breaks.</p>

                <p><em>Sentences</em> are calculated by counting any '.', '?' and '!' characters that are followed by a space, with one added to the total to account for the final sentence.</p>

                <p class="before-list">The calculation does not account for:</p>
                <ul>
                  <li>sentences that don't end with '.', '?' or '!'</li>
                  <li>text such as 'word/word', which would count as one word (though by extension pluralisation such as 'text/s' would correctly count as one)</li>
                  <li>text such as 'U.S. Congress', which would increase the sentence count regardless of whether 'U.S.' was the end of a sentence</li>
                  <li>any further complexities not captured by the method as described above</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        `;

      // insert text into reading level and text elements
      document.getElementById("reading-level").textContent = reading_level;
      document.getElementById("text").textContent = text;
    }
});
