---
layout: page
title:  "Tracking training"
---
Sometimes it is better and cheaper to extend general-purpose software than to craft a special-purpose app. 

My boss at an organization where I volunteer needed to 1) see at a glance who was behind on what training task; 2) let their supervisors know; and 3) preserve everyone's training history while 4) using widely-used, general-purpose, low-cost software (so it would be easy to maintain, train people to use, and modify as needed).

I wrote scripts (Google Apps Script) to extend a spreadsheet (Google Sheets) to display individuals' most recent trainings. That way, my boss could easily keep track of who was up to date on which training tasks. In the demo sheet below, red is overdue, pink is near due, and yellow warns about data entry errors. The script can email an individual's supervisor ('officer') when training is overdue. (Note: the email function is disabled in this demo version). 

A database might have made some of the data-management tasks easier, but without the other advantages. To make the system easy to maintain and train new users on, I used built-in spreadsheet functions as much as possible. Custom functions, written in Google Apps Script, were used to automate functions such as emailing supervisors.

<iframe src="https://docs.google.com/spreadsheets/d/1Pw6smlbVxPOk2I2I83is7f_Jy_g_OFiC_GdDxJ7QZ7A/edit?usp=sharing" width="100%" height="700px"></iframe>



 


