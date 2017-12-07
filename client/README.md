Debate App
----------

![Screenshot](https://raw.githubusercontent.com/beautron7/Debate-Thing/dev/screenshot%20of%20client.png)


#### What is this?
This app is intended to be used as an alternative for Paperless Debate's Verbatim,
which most policy debate teams use to author files.
While Verbatim is a good program,
It has some inherent limitations because it is built off of word.

Compared to verbatim,
you should notice faster performance,
better compatibility when running on a Mac,
and smaller file sizes.
It also will eventually be much easier to search for evidence or analytics compared to verbatim.

This program was designed to expand upon the functionality of verbatim, but it looks dramticaly different (a lot more colorfull).



#### Ok... but why use this over Verbatim?
Glad you asked. This program has / will have:

1. ###### Better storage efficiency
  - This program only saves one copy of each card, so whenever you save a new file, it just contains a reference to the card. you won't notice this, but it stops the same evidecne from existing in multple places on your dropbox.
2. ###### Drag and drop
    In the final version, you should be able to
  - Drag and drop cards from a reaserch pane with a search bar
  - Drag and drop sections from one doc to another
3. ###### A Better file format
  - Limitless Subheadings (instead of having pockets, hats, and blocks, you just have sections)
  - No way to accidentally change card text
  - Can be easily exported to a .html file which can be opened on virtualy anything (computer, phone, watch, kindle).
  - Space efficiency
4. ###### Cross-platform compatibility
  - Works exactly the same on windows, Mac, and Linux
  - Support for ChromeOS later on in development
5. ###### Native \_\_\_\_\_\_\_\_\_\_ Support
  - Better wiki Support
  - One click upload, no wierd formatting.
  - Tabroom support & integration with the wiki
6. ###### Improved in-round file organization
  - Send to speech includes an option to create a file name based off the current speech
  - More Reliable V-Tub
  - Browse dropbox files like a V-Tub from any document.

(Note that most of the featrues are not implemented yet, but are planned.)



#### What about my old files / Others opening my files?
Good news here. There should be import functionality by the release date, so you should be able to add your old dropbox folders into this editor. However, if your documents use "fake" formatting (if navbar doesn't work for you), then the import process may not work or may require manual intervention

By release, there will definitely be an option to export to either a .html file (looks like a normal doc but is read-only) and possibly even .docx exporting.

When it comes to opening other peoples files, you may need to just have a copy of word.



#### When can I use this?
Right now, the app is in its super-early stages, even if it looks complete.
Realistically, this app should be ready for use by **Spring 2018**.
If this sounds cool to you, please tell other people. If you have suggestions, Don't be afraid to ask. Constructive criticism is welcome.

There is a development preview however...



#### How can I try it right now?

Although __this project is still in development,__ you can try it out right now\* if you download this folder and a copy of `node.js`, then open up a terminal in the `client` folder, and type `npm run dev`. (you may need to be connected to a network)

\*Bugs on windows are being prioritized over mac/linux bugs, so it may not work on mac during large chunks of development.

This launches the current development build, which can give you an idea of what the program would look like.

You can test it out by running `npm run dev` if you have an internet connection, or
`npm start` in one window and `npm run electron` in another window.
