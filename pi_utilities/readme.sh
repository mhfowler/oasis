#!/usr/bin/env bash
FILE=$(pwd)/.readme
if [ -f $FILE ];
then
   cat $FILE
fi