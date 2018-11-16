---
layout: page
title:  "Tracking training"
---
Sometimes it is better to extend general-purpose software than to craft a special purpose app. 

My supervisor at an organization where I volunteer needed to 1) see who was behind on what training task at a glance, 2) let their supervisors know, and 3) preserve their training history, while 4) using widely-used, general-purpose, and low-cost software (so it would be easy to maintain, to train people to use, and to modify as needed). 

I wrote scripts (Google Apps Script) to extend a spreadsheet (Google Sheets) to that my supervisor could easily keep track of who was up to date on which training tasks, and email their supervisor when they were not (the email function is disabled in this demo version). A database might have made some of the data-management tasks more difficult, but without the other advantages. 

To make it easy to maintain and to make it easy to train new users, I used built-in spreadsheet functions as much as possible to display individual's most recent trainings for a set of required tasks, and how close they are to renewal deadlines. Custom functions (which were written in Google Apps Script, and can be set to trigger at specific times or events) are used to automate maintaining the reference ranges and email supervisors.

<iframe src="https://docs.google.com/spreadsheets/d/1Pw6smlbVxPOk2I2I83is7f_Jy_g_OFiC_GdDxJ7QZ7A/edit?usp=sharing" width="100%" height="700px"></iframe>



 


