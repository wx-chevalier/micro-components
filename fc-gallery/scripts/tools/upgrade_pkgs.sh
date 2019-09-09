#!/bin/bash
set -ex

ncu -u
 
(cd ./packages/fc-gallery-core && ncu -u)
(cd ./packages/rtw-bootstrap && ncu -u)
(cd ./packages/fc-gallery-react && ncu -u)
(cd ./packages/rtw-mobx-app && ncu -u)
