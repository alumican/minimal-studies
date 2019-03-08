#!/bin/sh

if [ $# -ge 1 ]; then
    if [ $1 = "install" ]; then
        # install node modules
        (cd build && npm install);
    elif [ $1 = "uninstall" ]; then
        # remove node modules, package-lock.json, tmp directory
        (cd build && rm -r -f node_modules && rm -f package-lock.json && rm -r -f tmp);
    else
        # run gulp task
        (cd build && gulp $1);
    fi
else
    if [ -e "build/node_modules" ]; then
        # run gulp default task
        (cd build && gulp);
    else
        # install 
        (cd build && npm install && gulp);
    fi
fi