import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Chartist from "chartist";
import {
    dailySalesChart,
    emailsSubscriptionChart,
    completedTasksChart
  } from "variables/charts.js";
export default function Charts ({data}){
    console.log(data)
    return (
        <ChartistGraph
                className="ct-chart"
                data={data.data}
                type="Line"
                options={{
                    lineSmooth: Chartist.Interpolation.cardinal({
                      tension: 0
                    }),
                    low: data.low,
                    high: data.high, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: {
                      top: 1,
                      right: 0,
                      bottom: 0,
                      left: 5
                    }
                  }}
                listener={emailsSubscriptionChart.animation}
                
              />
    )
}