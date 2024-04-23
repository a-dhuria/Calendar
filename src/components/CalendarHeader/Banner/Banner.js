import logo from "../../../assets/logo-pwc-white-2x.png";
import banner from "../../../assets/Cloud Academy - Internal header banner.png"
import { useNavigate } from "react-router-dom";
import "./Banner.css";

const Banner = (props) =>{
    const navigate = useNavigate();
    const handleBannerHomeOnClick = () =>{
        navigate('/')
    }
    const handleBannerAdminOnClick = () =>{
      navigate('/adminPage')
  }
    return (
      <div className="header-row-1">
        <div className="header-logos">
          <img src={logo} alt="PwC Logo - White outlined" className="logo" />
          <img src={banner} alt="PWC Banner" className="banner"/> 
        </div>
        <div className="header-navigation">
          <p className="header-row-1-title" onClick={handleBannerHomeOnClick}>{props.term} </p>
          <p className="header-row-1-title" onClick={handleBannerAdminOnClick}>{props.admin}</p>
        </div>
      </div>
    )
}

export default Banner