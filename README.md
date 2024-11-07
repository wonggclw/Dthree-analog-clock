# D3 analog clock training
## Sources:
- (Tom Pearson's D3 analog clock) [https://observablehq.com/@d3/simple-clock]

## Initial setup (done for you):
- Create Vite React Typescript app ``npm create vite@latest``
  - tutorial can be found here: https://blog.logrocket.com/build-react-typescript-app-vite/
  - Basic React component setup with props hooked up to App.tsx
To get this on your machine, run ``npm install`` and then ``npm run dev`` You should see a little message that says "if you can read this you can read"

## Add the basic setup for D3
- Run ``npm install d3``
- Add the d3 import to the top of your component: ``import * as d3 from "d3";``
- In useEffect return statement, remove all old svg elements on change so you don't get duplicates ``d3.select("svg").remove();``

## Create the SVG canvas
- Add the ID of container to the div in the return statement on line 44 so it looks like this:
```
return <div id="container">If you can read this, you can read!</div>;
```
- Here is the code to create the canvas, add it inside the drawCanvas function:
```
d3.select("#container")
    .append("svg")
    .attr("id", "mainContain")
    .attr("width", width)
    .attr("height", height);
```
## Add the data and scales
- On line 28 right above useEffect, we are going to add the tick marks and numbers for the clock. Usually this would be the axes for a graph, but we are going to make them into a circle and use them as tick marks on the clock instead.
```
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
```

## Make the data update every second
- add this to updateData()
```
const t = new Date();
    handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
    handData[1].value = t.getMinutes();
    handData[2].value = t.getSeconds();
```
- add function call ``updateData();`` to the top of the drawClock() function

## add the face to the clock
- Delete "If you can read this you can read" from inside the div
- Add this code inside the drawClock function
```
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
```
- At this point you should be able to see the clock face with no hands drawn on the screen

## add the hands to the clock
- Add this code to the drawClock function:
```
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
```
- Now you have a static clock with hands. Let's make it actually move.

## Make the clock hands move
- Add this code to moveHands:
```
d3.select("#clock-hands")
      .selectAll("line")
      .data(handData)
      .transition()
      .ease(d3.easeElastic.period(0.5))
      .attr("transform", (d) => `rotate(${d.scale(d.value)})`);
```