#!/bin/bash
set -ex

ncu -u
 
(cd ./packages/fc-schedule-core && ncu -u)
(cd ./packages/rtw-bootstrap && ncu -u)
(cd ./packages/fc-schedule-react && ncu -u)
(cd ./packages/rtw-mobx-app && ncu -u)
