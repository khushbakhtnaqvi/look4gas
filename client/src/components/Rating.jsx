import { Rating } from '@mui/material';
import { Star } from '@mui/icons-material';

export default function StationRating(props) {
  const { stationId, name, rating, address, cityId, phone, regular, ultra, premium, priceUpdates } = props;

  return (
    <div>
      Rating
      <Rating
        name="text-feedback"
        value={props.rating}
        readOnly
        precision={0.5}
        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
      />

    </div>

  );
}