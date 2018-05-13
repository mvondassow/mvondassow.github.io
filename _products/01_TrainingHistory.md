---
layout: page
title:  "Tracking training"
---

<img src="" alt="Table" style="float:right;width:300px;padding:10px">
This combines a spreadsheet  (Google Sheets) and associated scripts (Google Apps Script) to simplify keeping track of whether people were up to date on training tasks, and emailing their supervisor when they are not (the email function is disabled in this demo version).

The goal was to 1) see who was behind on what training task at a glance, 2) let their supervisor know, and 3) preserve their training history, while 4) using widely-used, general-purpose, and low-cost software (so it would be easy to maintain, to train people to use, and to modify as needed). A database might have made some of the data-management tasks more difficult, but without the other advantages. 

It mostly uses built-in spreadsheet functions -- in particular a pivot table and formating rules -- to display individual's most recent trainings for a set of required tasks, and whether they are past due on those trainings. This table takes its data from a sheet with all of their trainings recorded. Another sheet lists the individual's roles in the department and their supervisor, while a fourth sheet lists the training tasks (and their renewal periods) required for each role. Finally there is a sheet with contact information for the supervisors and a help sheet.

Custom functions (which were written in Google Apps Script, and can be set to trigger at specific times or events) are used to automate maintaining the reference ranges and email supervisors.

 


