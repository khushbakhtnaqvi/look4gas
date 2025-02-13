import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Rating } from '@mui/material';
import { Star } from '@mui/icons-material';
import moment from "moment";
import "./Reviews.scss";
import "./Button.scss";
import "./GasPriceItem.scss";
import { useParams } from "react-router-dom";
import ReviewItemList from "./ReviewItemList";

import { calculateRating } from "../helpers/ratingHelper";

import axios from "axios";

import { getUserIdFromPriceUpdate, getPriceUpdate, getMostRecentPriceUpdate } from "../helpers/selectors";

export default function Reviews(props) {

  const { gasStations, priceUpdates, reviews, state, setState } = props;

  const [userInfo, setUserInfo] = useState();

  let { id } = useParams();
  let gasStation = props.gasStations.find(gasStation => gasStation.id == id);

  // const [gasStation, setGasStation] = useState(props.gasStations.find(gasStation => gasStation.id == id))

  const priceUpdate = getMostRecentPriceUpdate(priceUpdates, id);
  console.log("STATE LINE 26", state);
  const GasName = gasStation.name.split(" ")[0];

  console.log({priceUpdate});
  useEffect(() => {
    //setGasStation(prev => ({ ...prev, rating: calculateRating(gasStation, reviews)}))
    // gasStation = props.gasStations.find(gasStation => gasStation.id == id);
    // gasStation.rating = calculateRating(gasStation, reviews)
    axios.get(`http://localhost:3001/api/users/`)
      .then(response => {
        console.log(" RESPONE DATA",response.data);
        console.log({priceUpdates, id});
        const priceSubmitUserId = getUserIdFromPriceUpdate(priceUpdates, id);
        console.log({priceSubmitUserId});
        axios.get(`http://localhost:3001/api/users/${priceSubmitUserId}`)
        .then(response => {
          setUserInfo(response.data);
        }).catch((err) => console.log("Error", err));
      }).catch((err) => console.log("Error", err));

    axios.get(`http://localhost:3001/api/gas_stations/`)
      .then(gasStations => {
        gasStation = gasStations.find(gasStation => gasStation.id == id);
        gasStation.rating = calculateRating(gasStation, reviews)
      })
      .catch((err) => console.log("Error", err));

  }, [priceUpdates, reviews]);

  return (
    <div className="BgColor">
      <div className="PriceBlock MarginReview">
        <div className="details_block">
          <div>
            <img className="gas_station_image" src={`../images/${GasName}.png`} alt="logo"/>
          </div>
          <div className="station_details StationDetail">
            <div>
              Name: {gasStation && gasStation.name}
            </div>
            <div>
            {gasStation && <Rating
                name="text-feedback"
                value={gasStation.rating}
                readOnly
                precision={0.5}
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />}
            </div>
            <div>
              Address: {gasStation && gasStation.address}, Toronto, ON <br></br>
            </div>
            <div>
              Phone: {gasStation && gasStation.station_phone}
            </div>
          </div>

        </div>

        {state.loggedIn && <div className="details_link ">
          <button
            className="button reviewbutton">
            <Link to={`/submit_price/${id}`}>Submit Price</Link>
          </button>

          <br></br>

          <button
            className="button reviewbutton">
            <Link to={`/write_review/${id}`}>Write Review</Link>
          </button>
        </div>}

      </div>
      <h3 className="HeadingPrice" >Prices</h3>
      <div className="PriceBlock">
        <div className="PriceHeadings">
          <div className="StationPrice center">
            Regular
          </div>
          <div className="StationPrice center ">
            Ultra
          </div>
          <div className="StationPrice center">
            Premium
          </div>
        </div>
        <div>
          <div className="details_block ">
            <div className="StationPrice BorderRight center">
              <h2> {gasStation && gasStation.regular_price} </h2>
            </div>
            <div className="StationPrice BorderRight center">
              <h2> {gasStation && gasStation.ultra_price} </h2>
            </div>
            <div className="StationPrice center">
              <h2> {gasStation && gasStation.premium_price} </h2>
            </div>
          </div>

          <div className="PriceHeadings">
            <div className="StationPrice center ">
            {!userInfo && <p>Loading...</p>}
            {userInfo && <p>{userInfo.first_name}</p>}
            {!priceUpdate && <p>---</p>}
            {priceUpdate && <p>{moment(priceUpdate.created_at).fromNow()}</p>}
            </div>
            <div className="StationPrice center ">
            {!userInfo && <p>Loading...</p>}
            {userInfo && <p>{userInfo.first_name}</p>}
            {!priceUpdate && <p>---</p>}
            {priceUpdate && <p>{moment(priceUpdate.created_at).fromNow()}</p>}
            </div>
            <div className="StationPrice center">
            {!userInfo && <p>Loading...</p>}
            {userInfo && <p>{userInfo.first_name}</p>}
            {!priceUpdate && <p>---</p>}
            {priceUpdate && <p>{moment(priceUpdate.created_at).fromNow()}</p>}
            </div>
          </div>
        </div>

      </div>
      <h3 className="HeadingReview" >Reviews</h3>      
      <ReviewItemList stationId={id} reviews={reviews} />
      <Outlet />
    </div>


  );
}