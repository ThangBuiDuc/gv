import { imgList as src } from "../src.jsx";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";

function ImgSlider() {
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  return (
    <>
      <AutoplaySlider
        play={true}
        // cancelOnInteraction={true}
        interval={6000}
        // cssModule={AwesomeSliderStyles}
        animation="scaleOutAnimation"
      >
        {src.map((item, index) => (
          <div className="wrapSlider" key={index} data-src={item.url} />
        ))}
      </AutoplaySlider>
    </>
  );
}

export default ImgSlider;
