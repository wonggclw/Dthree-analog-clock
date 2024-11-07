import { useState, useEffect, FC } from "react";

interface CircleProps {
  color: string;
  screenWidth: number;
  screenHeight: number;
}

const CircleClock: FC<CircleProps> = ({ color, screenWidth, screenHeight }) => {
  const clockRadius = 200,
    margin = 50,
    w = (clockRadius + margin) * 2,
    h = (clockRadius + margin) * 2,
    hourHandLength = (2 * clockRadius) / 3,
    minuteHandLength = clockRadius,
    secondHandLength = clockRadius - 12,
    secondHandBalance = 30,
    secondTickStart = clockRadius,
    secondTickLength = -10,
    hourTickStart = clockRadius,
    hourTickLength = -18,
    secondLabelRadius = clockRadius + 16,
    secondLabelYOffset = 5,
    hourLabelRadius = clockRadius - 40,
    hourLabelYOffset = 7,
    radians = Math.PI / 180;

  useEffect(() => {
    drawCanvas(screenWidth, screenHeight);
    drawClock();

    const timeInterval = setInterval(() => {
      updateData();
      moveHands();
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      // add line to clear the svg from the screen
    };
  }, []);

  return <div>If you can read this, you can read!</div>;

  function drawClock() {
    // stuff here!
  }

  function moveHands() {
    // stuff here!
  }

  function updateData() {
    // stuff here!
  }
};

export default CircleClock;

function drawCanvas(width: number, height: number) {
  // stuff here!
}