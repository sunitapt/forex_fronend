import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import { Box, IconButton, Input, Typography } from "@material-ui/core";
import { ArrowDownward, NavigateBefore } from "@material-ui/icons";
import { Link } from "react-router-dom";
import avatar from "assets/img/faces/marc.jpg";
import cardStlyesObj from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import cardStyle from "assets/jss/material-dashboard-react/components/cardStyle";
import axios from "axios"
import { API_URL } from "constants.js"
import { array } from "prop-types";

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
  }
};
const StyledRating = withStyles({
  iconFilled: {
    color: '#ffb400',
  },
  iconHover: {
    color: '#ffb400',
  },
})(Rating);
const useStyles = makeStyles(styles);
const cardStyles = makeStyles(cardStlyesObj)

function ReviewCard({ review }) {
  return (
    <Card>
      <GridContainer spacing={4} alignItems="center" justify="center">
        <GridItem xs={2}>
          <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
          <Typography variant="caption" gutterBottom size="small">
            {review.username}
          </Typography>
        </GridItem>
        <GridItem xs={4}>
          <Typography variant="body1" gutterBottom>
            {review.comments}
          </Typography>
        </GridItem>
        <GridItem xs={2}>
          <Rating value={parseInt(review.stars)} readOnly size="small" />
        </GridItem>
      </GridContainer>
    </Card>
  )
}

function NotificationCard({ notis }) {
  return (
    <Card>
      <GridContainer spacing={4} alignItems="center" justify="center">
        <GridItem xs={2}>
          <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
        </GridItem>
        <GridItem xs={7}>
          <Typography variant="body1" gutterBottom>
           {notis}
          </Typography>
        </GridItem>
      </GridContainer>
    </Card>
  )
}


export default function UserProfile(props) {
  var { user } = JSON.parse(localStorage.getItem('user'));

  const classes = useStyles();
  const classes2 = cardStyles();
  const [provider, setProvider] = useState([]);
  const [User, setUser] = useState(user);
  const [noti, setNoti] = useState(["Post will be shown here"]);
  const [value, setValue] = React.useState(3);
  const [comment, setComment] = React.useState("");
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR")
  const [filter, setFilter] = React.useState("Lowest")
  const [quantity, setQuantity] = React.useState(10)
  const [reviews, setReviews] = useState([])
  const [post, setPost] = useState("")
  const[disable,setDisable]=useState(false)
  var owner = false;
  const getData = async () => {
    let res = await axios.get(`${API_URL}/forexProviders/${props.match.params.name}?limit=${quantity}`)
    var rev = await axios.get(`${API_URL}/allratings/${res.data.title}`)
    let posts = await axios.get(`${API_URL}/notifications/${res.data.title}`)
    setReviews(rev.data)
    setProvider(res.data)
    setNoti(posts.data)
    setShow(user,res.data)
  }
  useEffect(() => {
    getData()
    let id = setInterval(getData, 60000)
    return () => clearInterval(id)
  }, [quantity])
  //console.log(serverUrl)
  const handlePost = e => {
    e.preventDefault();
    console.log(comment)
    axios.post(`${API_URL}/ratings/${provider.title}`, {
      username: User.username,
      stars: value,
      comment: comment
    }).then(res => {
      alert(res.data)
      reviews = [...reviews, res.data]
      setReviews(reviews)
    }
    )
  };
  const pushNotification = e => {
    console.log(post)
    console.log(provider.title)
    axios.post(`${API_URL}/notification`, {
      title: provider.title,
      notification: post
    }).then(res => {
      console.log(res.data)
      setNoti(res.data)
      setPost("")
      console.log(noti)
    })
  }
  const sendFollow = e => {
    console.log(post)
    axios.post(`${API_URL}/follow/${provider.title}`, {
      email: user.email
    }).then(res => {
      console.log(res.data)
      setDisable(true)
    })
  }
function setShow(user,provider){
    if(!user.title){
      provider.users.forEach(email => {
        if(user.email == email){
          setDisable(true)
        }
      });
    }
    if(user.title)
      setDisable(true)
}

  const getCards = () => {
    if(user.title == provider.title)
    owner = true
    return (
      <GridItem xs={12} sm={12} md={12} key={provider._id}>
        <Card chart>
          <CardHeader color="success">
            <Charts data={provider.rates.reduce((prev, rate) => {
              let date = new Date(rate.createdAt.valueOf())
              prev.data.labels.unshift(date.getHours() + ":" + date.getMinutes());
              prev.data.series[1].unshift(rate[`${from}${to}`].bid)
              prev.data.series[2].unshift(rate[`${from}${to}`].ask)
              prev.low = Math.min(prev.low, rate[`${from}${to}`].bid)
              prev.high = Math.max(prev.high, rate[`${from}${to}`].ask)
              return prev
            }, { data: { labels: [], series: [[], [], []] }, high: 0, low: 100 })} />
          </CardHeader>
          <CardBody>
            <Link to={"provider/" + provider.title}>

              <p className={classes2.cardCategory}>
                Bid rate{"  "}
                <span className={classes2.successText}>
                  <ArrowUpward className={classes2.upArrowCardCategory} /> {provider.rates.length != 0 ? provider.rates[0][`${from}${to}`].bid : 0}
                </span>
              </p>
              <p className={classes2.cardCategory}>
                Offer rate {"  "}
                <span className={classes2.dangerText}>
                  <ArrowDownward className={classes2.upArrowCardCategory} /> {provider.rates.length != 0 ? provider.rates[0][`${from}${to}`].ask : 0}
                </span>

              </p>
            </Link>
          </CardBody>

          <CardFooter chart>
            <div className={classes2.stats}>
              <AccessTime /> updated {provider.rates.length != 0 ? (new Date().getMinutes() - new Date(provider.rates[0].createdAt).getMinutes()) : 0} minutes ago
          </div>
          </CardFooter>
        </Card>
      </GridItem>)
  }
  return (
    <div>
      {console.log(provider)}
      {console.log(reviews)}
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>Forex Provider</h6>
              <h4 className={classes.cardTitle}>{provider.title}</h4>
              <p className={classes.description}>
                {provider.about}
              </p>
              <Button color="primary" round onClick={sendFollow} disabled={disable}>
                Click to Follow
              </Button>
              <p>
                <p className={classes.description}>
                  {provider.contact}
                </p>
                <Rating name="read-only" value={parseInt(provider.stars)} readOnly size="small" />
              </p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          {provider.title ? getCards() : ""}
          <CurrencyMenu showFilter={false} to={to} from={from} filter={filter}
            setFilter={setFilter} setFrom={setFrom} setTo={setTo} quantity={quantity} setQuantity={setQuantity} />
        </GridItem>


        {user.title && owner && <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Post Notifications</h4>
              <p className={classes.cardCategoryWhite}>Will be shown to people following you</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>Post Content</InputLabel>
                  <Input
                    labelText="Posting regulary to stay in connect with your customers can help..."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                    onChange={(event, newValue) => {
                      setPost(event.target.value);
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={pushNotification}>Post</Button>
            </CardFooter>
          </Card>
        </GridItem>}

        {!user.title && <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Review Providers</h4>
              <p className={classes.cardCategoryWhite}>Helpful for newbies and feedback for Provider</p>
            </CardHeader>
            <CardBody>
              <GridContainer alignItems="center">
                <GridItem xs={12} sm={12} md={12}>

                  <Typography component="legend">Rating</Typography>
                  <StyledRating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    size="large"
                  />

                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>Review Content</InputLabel>
                  <Input
                    labelText="Your review is important to us"
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 2
                    }}
                    onChange={(event, newValue) => {
                      console.log(`c ${event.target.value}`)
                      setComment(event.target.value);
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={handlePost}>Post</Button>
            </CardFooter>
          </Card>
        </GridItem>}


        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Previous Posts</h4>
              <p className={classes.cardCategoryWhite}>Will be shown to people following you</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                {noti.map((notis, index) => {
                    return (<NotificationCard notis={notis} />)
                  })}

                </GridItem>

              </GridContainer>
            </CardBody>

          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Reviews</h4>
              <p className={classes.cardCategoryWhite}>Past Experiences of Customers</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  {reviews.map((review, index) => {
                    return (<ReviewCard review={review} />)
                  })}
                </GridItem>

              </GridContainer>
            </CardBody>

          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Maps />
        </GridItem>

      </GridContainer>
    </div>
  );
}
