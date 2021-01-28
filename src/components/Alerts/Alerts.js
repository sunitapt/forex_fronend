import React,{useState,useEffect} from "react";
// @material-ui/core components
import { makeStyles,withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Input from '@material-ui/core/Input';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import ChartistGraph from "react-chartist";
import Avatar from '@material-ui/core/Avatar';
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Rating from '@material-ui/lab/Rating';
import CurrencyMenu from "components/CurrencyMenu/CurrencyMenu"
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Maps from "views/Maps/Maps"
import Charts from "components/Charts/Charts.js"

import { Box, IconButton, Typography } from "@material-ui/core";
import { ArrowDownward, NavigateBefore } from "@material-ui/icons";
import { Link } from "react-router-dom";
import avatar from "assets/img/faces/marc.jpg";
import cardStlyesObj from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import cardStyle from "assets/jss/material-dashboard-react/components/cardStyle";
import axios from "axios"
import {API_URL} from "constants.js"
import {
    successColor,
    whiteColor,
    grayColor,
    hexToRgb,
    dangerColor
  } from "assets/jss/material-dashboard-react.js";

//import styles2 from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
const styles = {
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
    stats: {
        color: grayColor[0],
        display: "inline-flex",
        fontSize: "12px",
        lineHeight: "22px",
        "& svg": {
          top: "4px",
          width: "16px",
          height: "16px",
          position: "relative",
          marginRight: "3px",
          marginLeft: "3px"
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
          top: "4px",
          fontSize: "16px",
          position: "relative",
          marginRight: "3px",
          marginLeft: "3px"
        }
      }
  };
  const useStyles = makeStyles(styles);


  export default function Alerts(props) {
    const classes = useStyles();

    const [providers,setProviders]=React.useState([])
    const [from, setFrom] = React.useState("USD");
    const [to,setTo]=React.useState("EUR")
    const [rate,setRate]=React.useState(0)
    const[quantity,setQuantity]=React.useState(10)
    const[type,setType]=React.useState("bid")
    const [prevAlerts,setAlerts]=React.useState({})
    const getData=async ()=>{
        let res= await axios.get(`${API_URL}/alerts`)
        console.log(res.data)
        setAlerts(res.data)
    }
    useEffect(()=>{
        let id=setInterval(getData,5000)
        return ()=>clearInterval(id)
        getData()
    },[])
    const getAlerts=()=>{
        return(prevAlerts.map((alert,idx)=>{
            return(
            <Card key={alert._id}>
            <CardHeader color={alert.completed?"success":"danger"}>
                <GridContainer>
                    <GridItem xs={12} md={4}>Rate Set: {alert.rate}</GridItem>
                    <GridItem xs={12} md={4}>Curenncy: {alert.currency}</GridItem>
                    <GridItem xs={12} md={4}>Trade: {alert.bidask}</GridItem>
                   
                </GridContainer>
                
            </CardHeader>
            <CardBody>
                <GridContainer>
                    
                    {alert.completed&&<Link to={`/admin/provider/${alert.trader}`}><GridItem xs={12} >Trader who completed: {alert.trader}</GridItem></Link>}
                    {alert.completed&&<GridItem xs={12} >Saved: {alert.saved}</GridItem>}
                    
                </GridContainer>
            </CardBody>
            <CardFooter>
            <GridContainer justify="space-between">
                    <GridItem className={classes.stats} xs={12} md={4}>Created at {(new Date(alert.createdAt)).toLocaleTimeString()}</GridItem>
                    {alert.completed&&<GridItem xs={12} md={4}>Completed at {(new Date(alert.createdAt)).toLocaleTimeString()}</GridItem>}
                    <GridItem  className={classes.stats} xs={12} md={4}><Button color="danger" onClick={()=>{
                        handleDelete(alert._id)
                    }}>delete</Button></GridItem>
                </GridContainer>
            </CardFooter>
            </Card>)
        }))
    }
    const handleClick=async (e)=>{
        e.preventDefault()
        
        let obj={rate,currency:`${from}${to}`,bidask:type,ammount:quantity}
        let res= await axios.post(`${API_URL}/alerts`,obj)
        console.log(res.data)
        
        getData()

    }
    const handleDelete=async (id)=>{
       
        let res= await axios.delete(`${API_URL}/alerts/${id}`)
        console.log(res.data)
        
        getData()
    }
    return (
        <GridContainer >
            <GridItem xs={12} sm={12} md={6} >
                <Card>
                    <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Set Alerts</h4>
                    <p className={classes.cardCategoryWhite}>Get your Popcorns we will notify you when a particular rate achieves</p>
                    </CardHeader>
                    <CardBody>
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={4}>
                        
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="from">
                            From
                            </InputLabel>
                            <Select
                            labelId="from"
                            id="from"
                            name="from"
                            value={from}
                            onChange={(e)=>{
                                setFrom(e.target.value)
                            }}
                            
                            >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"EUR"}>EUR</MenuItem>
                            <MenuItem value={"INR"}>INR</MenuItem>
                            </Select>
                            <FormHelperText>You have this currency</FormHelperText>
                        </FormControl>
                        </GridItem>
                        <GridItem xs={12} md={4}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="from">
                            To
                            </InputLabel>
                            <Select
                            labelId="from"
                            id="from"
                            name="from"
                            value={to}
                            onChange={(e)=>{
                                setTo(e.target.value)
                            }}
                            
                            >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"EUR"}>EUR</MenuItem>
                            <MenuItem value={"INR"}>INR</MenuItem>
                            </Select>
                            <FormHelperText>You want this currency</FormHelperText>
                        </FormControl>
                        </GridItem>
                        <GridItem xs={12} md={4}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="from">
                                Rate
                                </InputLabel>
                            <Input value={rate} type="number" min={1} inputProps={{ 'aria-label': 'description',min: 1 }}  onChange={(e)=>{
                                setRate(e.target.value)
                            }}/>
                            <FormHelperText>Rate you expect</FormHelperText>
                        </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                        
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="from">
                            Trade
                            </InputLabel>
                            <Select
                            labelId="from"
                            id="from"
                            name="from"
                            value={type}
                            onChange={(e)=>{
                                setType(e.target.value)
                            }}
                            
                            >
                            <MenuItem value={"bid"}>Bid</MenuItem>
                            <MenuItem value={"ask"}>Ask</MenuItem>
                            
                            </Select>
                            <FormHelperText>Type of Transaction</FormHelperText>
                        </FormControl>
                        </GridItem>
                        <GridItem xs={12} md={4}>
                        <FormControl className={classes.formControl}>
                            <InputLabel shrink id="from">
                                Units of {from}
                                </InputLabel>
                            <Input value={quantity} type="number" min={1} inputProps={{ 'aria-label': 'description',min: 1 }}  onChange={(e)=>{
                                setQuantity(e.target.value)
                            }}/>
                            <FormHelperText>{from} units you want to convert</FormHelperText>
                        </FormControl>
                        </GridItem>
                    </GridContainer>
                    </CardBody>
                    <CardFooter>
                    <Button color="primary" onClick={handleClick}>Set</Button>
                    </CardFooter>
                </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
                <Card>
                    <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Alerts Previously Set</h4>
                    <p className={classes.cardCategoryWhite}>alerts you set previously set</p>
                    </CardHeader>
                    <CardBody>
                    <GridContainer>
                        {prevAlerts.length>0?getAlerts():"No Alerts Set"}
                    </GridContainer>
                    </CardBody>
                    
                </Card>
        </GridItem>
        </GridContainer>
    )
  }