# cycling-calculator

-----

library for cycling-related computations


## usage in google workspace spreadsheet

the lib exposes the following methods:
- **calcPower:** compute the power required to go at a given speed
- **calcSpeed:** compute the speed reached when genreating a given power

see the *docstrings* for more info on the parameters.

### publish/deploy script

Use `clasp push` to publish the code to the spreadsheet, and `clasp status` to view the published state.
(see [the google documentation on clasp](https://developers.google.com/apps-script/guides/clasp)).