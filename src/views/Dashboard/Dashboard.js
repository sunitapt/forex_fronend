import React,{useState, useEffect} from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Avatar from '@material-ui/core/Avatar';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Rating from '@material-ui/lab/Rating';
import CurrencyMenu from "components/CurrencyMenu/CurrencyMenu.js"
import Charts from 'components/Charts/Charts.js'
import axios from "axios"
import Alerts from "components/Alerts/Alerts"
import { bugs, website, server } from "variables/general.js";
import setTokenHeader from "services/api"
import data from "currency.js"
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Grid, IconButton } from "@material-ui/core";
import { ArrowDownward, NavigateBefore } from "@material-ui/icons";
import { Link } from "react-router-dom";
import {API_URL} from "constants.js"
const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  console.log(props)
  const classes = useStyles();
  const [providers,setProviders]=useState([])
  const [from, setFrom] = React.useState("USD");
  const [to,setTo]=React.useState("EUR")
  const [filter,setFilter]=React.useState("Rating")
  const[quantity,setQuantity]=React.useState(10)
  const userSignedIn= ()=>{
    let token=localStorage.getItem("jwtToken")
    if(!token){
      console.log(token)
      ///setTokenHeader(token)
      console.log(props)
      props.history.push("/signin")
    }
    setTokenHeader(token)
    

  }
  userSignedIn()
  
  const getData=async ()=>{
    let res= await axios.get(`${API_URL}/allforexProviders?limit=`+quantity)
    //console.log(res.data)
    setProviders(res.data)
  }
  
  useEffect(()=>{
    getData()
    let id=setInterval(getData,5000)
    return ()=>clearInterval(id)
  },[quantity])

  const sortComparator=(a,b)=>{
    let bidA=a.rates.length!=0?a.rates[0][`${from}${to}`].bid:0
    let bidB=b.rates.length!=0?b.rates[0][`${from}${to}`].bid:0
    if(filter=="Lowest")
      return bidA-bidB
    if(filter=="Highest")
      return bidB-bidA
    if(filter=="Rating")
      return b.stars-a.stars 
  }

  const getCards=()=>{
    
    return (providers.sort(sortComparator).map((provider,idx)=>{
      let bidChange= provider.rates.length>1?((provider.rates[0][`${from}${to}`].bid-provider.rates[1][`${from}${to}`].bid)).toFixed(7):0;
      let askChange= provider.rates.length>1?((provider.rates[0][`${from}${to}`].ask-provider.rates[1][`${from}${to}`].ask)).toFixed(7):0;
      let spreadChange=(askChange-bidChange).toFixed(7)
      let bid= provider.rates.length!=0?provider.rates[0][`${from}${to}`].bid:0
      let ask= provider.rates.length!=0?provider.rates[0][`${from}${to}`].ask:0
      let spread=(ask-bid).toFixed(7)
      let endTime=new Date(provider.rates.length!=0?provider.rates[0].createdAt:Date.now).toLocaleTimeString()
      let startTime=new Date(provider.rates.length!=0?provider.rates[provider.rates.length-1].createdAt:Date.now).toLocaleTimeString()
      let highestBid=0,lowestBid=1000,highestAsk=0,lowestAsk=0,lowestSpread=Number.MAX_SAFE_INTEGER,highestSpread=Number.MIN_SAFE_INTEGER;
      for(let rate of provider.rates){
        let b=rate[`${from}${to}`].bid
        let a=rate[`${from}${to}`].ask
        let s=(a-b).toFixed(7)

        highestBid=Math.max(highestBid,b)
        lowestBid=Math.min(lowestBid,b)

        highestAsk=Math.max(highestAsk,a)
        lowestAsk=Math.min(lowestAsk,a)

        highestSpread=Math.max(highestSpread,s)
        lowestSpread=Math.min(lowestSpread,s)
      }

      return (
    <GridItem xs={12} sm={12} md={10} key={provider._id}>
      <Card chart>
        <CardHeader color={bidChange>0?"success":"primary"}>
          <Charts data={provider.rates.reduce((prev,rate)=>{
            
            let date=new Date(rate.createdAt.valueOf())
            // date.setHours(date.getHours() + 5);
            // date.setMinutes(date.getMinutes() + 30);
            
            prev.data.labels.unshift(date.getHours()+":"+date.getMinutes());

            prev.data.series[1].unshift(rate[`${from}${to}`].bid)
            prev.data.series[2].unshift(rate[`${from}${to}`].ask)
            prev.low=Math.min(prev.low,rate[`${from}${to}`].bid)
            prev.high=Math.max(prev.high,rate[`${from}${to}`].ask)
            return prev
          },{data:{labels:[],series:[[],[],[]]},high:0,low:100})}/>
        </CardHeader>
        <CardBody>
          <Link to={"provider/"+provider.title}>
        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
          <div style={{display:"flex",justifyContent:"space-between"}}>
    <h4 className={classes.cardTitle}>{provider.title}</h4>
          <Rating  size="small" value={parseInt(provider.stars)} readOnly />
          </div>
          <GridContainer>
            <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Bid rate{"  "}
            <span className={bid>=0?classes.successText:classes.dangerText}>
            {bid>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />}
            {bid}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Ask rate {"  "}
            <span className={ask>=0?classes.successText:classes.dangerText}>
            {ask>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />} 
              {ask}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Spread rate {"  "}
            <span className={spread>=0?classes.successText:classes.dangerText}>
            {spread>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />} 
              {spread}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Latest Bid Change {"  "}
            <span className={bidChange>=0?classes.successText:classes.dangerText}>
            {bidChange>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />} 
              {bidChange}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Latest Ask Change {"  "}
            <span className={askChange>=0?classes.successText:classes.dangerText}>
            {askChange>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />} 
              {askChange}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Latest Spread Change {"  "}
            <span className={spreadChange>=0?classes.successText:classes.dangerText}>
            {spreadChange>=0?<ArrowUpward className={classes.upArrowCardCategory} />:<ArrowDownward className={classes.upArrowCardCategory} />} 
              {spreadChange}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Highest Bid {"   "}
            <span >
            {highestBid}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Highest Ask {"   "}
            <span >
            {highestAsk}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Highest Spread {"   "}
            <span >
            {highestSpread}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Lowest Bid {"   "}
            <span >
            {lowestBid}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Lowest Ask {"   "}
            <span >
            {lowestAsk}
            </span>
          </p>
          </GridItem>
          <GridItem xs={4}>
          <p className={classes.cardCategory}>
            Lowest Spread {"   "}
            <span >
            {lowestSpread}
            </span>
          </p>
          </GridItem>
          </GridContainer>
          </Link>
        </CardBody>
        
        <CardFooter chart>
          
          <div className={classes.stats}>
            <AccessTime /> updated {provider.rates.length!=0?(new Date().getMinutes()-new Date(provider.rates[0].createdAt).getMinutes()):0} minutes ago
          </div>
          <div className={classes.stats}>
            <AccessTime /> Start Time {startTime}
          </div>
          <div className={classes.stats}>
            <AccessTime /> Last Rate {endTime}
          </div>
        </CardFooter>
      </Card>
  </GridItem>)}))
  }
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Alerts Fulfiled/Set</p>
              <h3 className={classes.cardTitle}>
                10/15
              </h3>
            </CardHeader>
            <CardFooter stats>
            <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Forex Providers</p>
              <h3 className={classes.cardTitle}>3</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Money Saved</p>
              <h3 className={classes.cardTitle}>$7500</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
              <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Users</p>
              <h3 className={classes.cardTitle}>+5</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* //Menu bar for filter */}
      <CurrencyMenu showFilter={true} to={to} from={from} filter={filter} setFilter={setFilter} setFrom={setFrom} setTo={setTo} quantity={quantity} setQuantity={setQuantity}/>


      

      {/* forexcard */}
      <GridContainer justify="center">
        {providers.length>0?getCards():""}


        <GridItem xs={12} sm={12} md={10} key={12222}>
      <Card chart>
        <CardHeader color="primary">
          <Charts data={data[`${from}${to}`].slice(0,quantity).reduce((prev,rate,ind)=>{
            let date= new Date()
            date=date.setDate(date.getDate()+ind)
            console.log(prev)
            prev.data.labels.push(new Date(date).toLocaleDateString())
            prev.data.series[0].push(rate)
            prev.low=Math.min(prev.low,rate)
            prev.high=Math.max(prev.high,rate)
            return prev
          },{data:
          {labels:[],series:[[]]}
          ,high:0,low:100})}/>
        </CardHeader>
        <CardBody>
          
        <Avatar alt="Remy Sharp" src="data:image/jpeg;base64,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" />
          <div style={{display:"flex",justifyContent:"space-between"}}>
    <h4 className={classes.cardTitle}>Model Predictions</h4>
    <Rating  size="small" value={5} readOnly />
          </div>
          <GridContainer>
            <GridItem>Prediction based on our Machine learning Model</GridItem>
            
         
         
          
         
          </GridContainer>
          
        </CardBody>
        
        <CardFooter chart>
          
          {/* <div className={classes.stats}>
            <AccessTime /> updated {provider.rates.length!=0?(new Date().getMinutes()-new Date(provider.rates[0].createdAt).getMinutes()):0} minutes ago
          </div>
          <div className={classes.stats}>
            <AccessTime /> Start Time {startTime}
          </div>
          <div className={classes.stats}>
            <AccessTime /> Last Rate {endTime}
          </div> */}
        </CardFooter>
      </Card>
  </GridItem>
      </GridContainer>
      <Alerts providers={providers}/>  
    </div>
  );
}
