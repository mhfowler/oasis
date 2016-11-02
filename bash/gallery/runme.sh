#!/usr/bin/env bash
FILE=$(pwd)/.runme
if [ -f $FILE ];
then
   bash $FILE
fi