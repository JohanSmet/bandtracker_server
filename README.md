# BandTracker Server

The server component for [BandTracker](https://github.com/JohanSmet/bandtracker), an app I developed as part of the Udacity iOS Developer NanoDegree I completed in 2015.

It's a node.js program written in TypeScript using the [Express](https://expressjs.com/) framework and [mongoose](https://mongoosejs.com/) to access a MongoDB database. 

If left to my own devices I'd probably end up writing the webservice in C/C++.  But that didn't seem like a good match for my target audience. For a previous online course I was forced to wrote a webservice in Java using the [Spring Framework](http://spring.io/). If you can ignore all the abstraction layers and general bloat, the java part was actually pretty ok to work with. I chose node.js (and Express) because it seemed a popular choice at the time and I wanted to see how this compares to working tomcat and Spring. 

I really don't like using dynamically typed language, for anything bigger that a one-shot shell script, so in came TypeScript to help me save (what was left of) my sanity.

