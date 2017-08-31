#!/bin/bash

# from https://prupert.wordpress.com/2010/08/02/stream-live-audio-from-a-microphone-in-near-real-time-in-ubuntu/

echo killing old ffmpegs

PID=( $(ps -e | grep ffmpeg | awk '{print $1;}'))

if [ $? = 1 ]; then
    echo "error getting vlc PID, exiting"
    exit
fi

if [ ! -n "$PID" ]; then
    PID=1234567
fi

echo killing ffmpeg with PID $PID
kill $PID

echo starting ffmpeg
ffmpeg -f oss -i /dev/dsp -acodec libmp3lame -ab 32k -ac 1 -re -f
rtp rtp://234.5.5.5:1234 2> ~/ffmpeg.log &
FF=$!
echo ffmpeg started with PID $FF
exit
