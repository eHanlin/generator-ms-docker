#!/bin/bash

currentPath=$(echo $0  | sed -e "s/[^/]*$//g")

if [[ "$currentPath" =~ ^./$  ]]; then
  entryPointer=$(pwd)
elif [[ "$currentPath" =~ ^./ ]] ;then
  entryPointer=$(pwd)$(echo $currentPath | sed -e "s/\.\//\//g")
elif [[ "$currentPath" =~ ^/ ]]; then
  entryPointer=$(echo $currentPath | sed -e "s/\/$//g")
elif [[ "$currentPath" =~ ^.+ ]] ;then
  entryPointer=$(pwd)/$currentPath
fi

projectName=<%= appname %>
iniFileName=$projectName".ini"
iniFilePath="${entryPointer}/${iniFileName}"
daemonizePath="/tmp/${projectName}.pid"

while [[ $# > 1 ]]; do
    case $1 in
      --no-daemonize)
        noDaemonize=false
        ;;
      -cmd)
        cmd=$2
        shift
        ;;
    esac
    shift
done

if [ -f ${entryPointer}/${iniFileName} ]; then
  initExist=true
  #echo "file is exist..."
else
  initExist=false
  #echo "not found file..."
fi

build_ini () {
  echo "[uwsgi]" > $iniFilePath
  echo "chdir=${entryPointer}" >> $iniFilePath
  echo "module=app:app" >> $iniFilePath
  echo "master=True" >> $iniFilePath
  echo "processes=10" >> $iniFilePath
  echo "max-requests=5000" >> $iniFilePath
  echo "socket=0.0.0.0:4000" >> $iniFilePath

  if [[ -z $noDaemonize ]]; then
    echo "daemonize=/tmp/${projectName}.log" >> $iniFilePath
    echo "pidfile=${daemonizePath}" >> $iniFilePath
  fi
}

build_ini
psScript=$(ps aux|grep $iniFileName)
#echo $psScript

if [[ "$psScript" =~ "uwsgi --ini" && "$psScript" =~ "${iniFileName}" ]]; then
  hasProcessing=true
else
  hasProcessing=false
fi

#echo $hasProcessing

start_uwsgi () {
  [ $hasProcessing = false ] && uwsgi --ini $iniFilePath
  hasProcessing=true
}

stop_uwsgi () {
  [ $hasProcessing = true ] && uwsgi --stop $daemonizePath
  hasProcessing=false
}

case "$cmd" in
  start)
    echo "start..."
    start_uwsgi
    ;;
  stop)
    echo "stop..."
    stop_uwsgi
    ;;
  restart)
    echo "restart..."
    stop_uwsgi
    sleep 2
    start_uwsgi
    ;;
  *)
    echo "Usage: -cmd {start|stop|restart}" >&2
    exit 3
    ;;

esac

