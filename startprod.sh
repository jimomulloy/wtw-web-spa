#!/bin/bash
 
# Invoke the Forever module (to START our Node.js server).
npm install
export NODE_ENV=production
forever start -al forever.log -ao out.log -ae err.log app.js