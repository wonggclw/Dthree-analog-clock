import { useState, useEffect, FC } from "react";
import * as d3 from "d3";

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

    const twelve = d3.scaleLinear().range([0, 360]).domain([0, 12]);
    const sixty = d3.scaleLinear().range([0, 360]).domain([0, 60]);
    
      const handData = [
        {
          type: "hour",
          value: 0,
          length: -hourHandLength,
          scale: twelve,
        },
        {
          type: "minute",
          value: 0,
          length: -minuteHandLength,
          scale: sixty,
        },
        {
          type: "second",
          value: 0,
          length: -secondHandLength,
          scale: sixty,
          balance: secondHandBalance,
        },
      ];

  useEffect(() => {
    drawCanvas(screenWidth, screenHeight);
    drawClock();

    const timeInterval = setInterval(() => {
      updateData();
      moveHands();
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      d3.select("svg").remove();
    };
  }, []);

  return <div id="container">If you can read this, you can read!</div>;

  function drawClock() {
    const svg = d3.select("#mainContain");
    const face = svg
      .append("g")
      .attr("id", "clock-face")
      .attr("transform", `translate(${[w / 2, h / 2]})`);

    face
      .selectAll(".second-tick")
      .data(d3.range(0, 60))
      .enter()
      .append("line")
      .attr("class", "second-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", secondTickStart)
      .attr("y2", secondTickStart + secondTickLength)
      .attr("transform", (d) => `rotate(${sixty(d)})`)
      .attr("stroke", color);

    face
      .selectAll(".second-label")
      .data(d3.range(5, 61, 5))
      .enter()
      .append("text")
      .attr("class", "second-label")
      .attr("text-anchor", "middle")
      .attr("x", (d) => secondLabelRadius * Math.sin(sixty(d) * radians))
      .attr(
        "y",
        (d) =>
          -secondLabelRadius * Math.cos(sixty(d) * radians) + secondLabelYOffset
      )
      .text((d) => d)
      .attr("fill", color);

    face
      .selectAll(".hour-tick")
      .data(d3.range(0, 12))
      .enter()
      .append("line")
      .attr("class", "hour-tick")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", hourTickStart)
      .attr("y2", hourTickStart + hourTickLength)
      .attr("transform", (d) => `rotate(${twelve(d)})`)
      .attr("stroke", color);

    face
      .selectAll(".hour-label")
      .data(d3.range(3, 13, 3))
      .enter()
      .append("text")
      .attr("class", "hour-label")
      .attr("text-anchor", "middle")
      .attr("x", (d) => hourLabelRadius * Math.sin(twelve(d) * radians))
      .attr(
        "y",
        (d) =>
          -hourLabelRadius * Math.cos(twelve(d) * radians) + hourLabelYOffset
      )
      .text((d) => d)
      .attr("fill", color);

      const hands = face.append("g").attr("id", "clock-hands");

    hands
      .selectAll("line")
      .data(handData)
      .enter()
      .append("line")
      .attr("class", (d) => d.type + "-hand")
      .attr("x1", 0)
      .attr("y1", (d) => d.balance || 0)
      .attr("x2", 0)
      .attr("y2", (d) => d.length)
      .attr("transform", (d) => `rotate(${d.scale(d.value)})`)
      .attr("stroke", color);

    face
      .append("g")
      .attr("id", "face-overlay")
      .append("circle")
      .attr("class", "hands-cover")
      .attr("fill", color)
      .attr("x", 0)
      .attr("y", 0)
      .attr("r", clockRadius / 20);
  }

  function moveHands() {
    d3.select("#clock-hands")
      .selectAll("line")
      .data(handData)
      .transition()
      .ease(d3.easeElastic.period(0.5))
      .attr("transform", (d) => `rotate(${d.scale(d.value)})`);
  }

  function updateData() {
    const t = new Date();
    handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
    handData[1].value = t.getMinutes();
    handData[2].value = t.getSeconds();
  }
};

export default CircleClock;

function drawCanvas(width: number, height: number) {
  d3.select("#container")
    .append("svg")
    .attr("id", "mainContain")
    .attr("width", width)
    .attr("height", height);
}