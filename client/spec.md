# Specifications for storage
## Cards
#### Raw text
The raw text of cards is saved as an array of paragraphs:
```json
"text":[
  "Lorem ipsum dolor sit amet",
  "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
]
```
Whenever a card is added, it is also added to a cloud repository.
The whole card is saved as two separate objects:
```json
{
  "ID":"",
  "title":"Example web page",
  "dateCaught":"2017-08-22T18:09:51.520Z",
  "datePublished":"2017-08-22T18:09:51.520Z",
  "author":"Maid upname",
  "url":"Example.com/index.html",
  "keywords":["China","US","(...)"],
  "dbSignature":"(none or signature)"
}

{
  "ID":"//Card id",
  "textHash":"//Hash of text",
  "text":[
    "//Text goes here"
  ]
}
```


These cards are collectivly saved in a folder containing a single `cardMetadata.json` file and a subfolder containing many `{cardID}.cardText.json` files. All Metadata files are referenced by a single `usrSettings.json` file. All three files are defined below.

```json
folder/cardMetadata.json
{
  "collectionName":"Beau-VanDenburgh-19-Dropbox",
  "lastUpdated":"2017-08-22T18:09:51.520Z",
  "created":"2017-08-22T18:09:51.520Z",
  "cards":[
    "//This is where the card JSON goes, sorted by id"
  ]
}


folder/cards/(cardID).cardText.json
{
  "ID":"//Card ID",
  "text":[
    "//text"
  ]
}

usrSettings.json
{
  "cardSrces":[
    "path/to/*.cardCollection.json",
    " /* etc. */ "
  ]
}
```
#### Formatting
To save formatting in a space-efficient way, every style used is saved and refrenced by a number. Here are some examples of styles
- `"(12pt)<BUIR>{Cyan,Green}"` = 12pt font, Bold, Italic, rectangular box around text underline, cyan highlighting, green text.
- `"(12pt)<Bi>{,Red}"` = 12pt font, Bold, not italic, inherit underline, inherit highlight, but Red text.
- All styles inherit their properties from the first (0th) style. **Always.**

These predefined styles are then applied using a string formatted like `{stylenumber}:{numchars to advance};`

Here is an example of style definitions
```json
{
  "styles":[
    "(12pt)<bui>{White,Black}",
    "(14pt)",
    "<BUR>",
  ],
  "locations":"1:10;0:43;2:20;"
}
```
In the editor, styles are rendered with html like this
```html
<!-- Style excluded -->
<div>
  <span>Hi </span><span class="yellow-hi">Hello</span>
</div>
<div>
  <span>This is a new Para</span><span class="yellow-hi">graph</span>
</div>
```
Which looks like this:
<div>
  <style>
    .yellow-hi {
      background-color: #FFFF00;
    }
  </style>
  <div>
    <span>Hi </span><span class="yellow-hi">Hello</span>
  </div>
  <div>
    <span>This is a new Para</span><span class="yellow-hi">graph</span>
  </div>
</div>
#### Card Instances  

What's stored in the editor in memory:
```json
{
  "ID":"//Hash of URL or Title",
  "title":"Global warming",
  "tag":"Example web page",
  "dateCaught":"2017-08-22T18:09:51.520Z",
  "datePublished":"2017-08-22T18:09:51.520Z",
  "text":[
    "//This is where the paragraphs go"
  ],
  "author":"Maid upname",
  "url":"Example.com/index.html",
  "formatting":{},
  "quals":"",
  "authorID":"//Hash of author's full name and date of birth"
}
```
What's stored on disk in a file that mentions a card:
```json
{
  "ID":"//Hash of URL or Title",
  "tag":"Example web page",
  "formatting":{},
  "quals":"",
}
```

## Files
Files / documents / speeches are stored as json objects, and sections are stored as arrays, with the first element being the title. eg:

```json
[
  "Document title",
  [
    "Subsection 1",
    {
      "_":"Card Goes here"
    }
  ]
]
```
