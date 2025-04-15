import React from "react"
import {useSelector} from "react-redux"
import ProfileImg from "../images/profile.jpg";

const Banner = () =>{
    

    const {auth} = useSelector(state => state)
    const bannerImage = auth.user?.avatar ? auth.user.avatar : ProfileImg;
    return (
        <div style={{backgroundImage: `url(${bannerImage})`, height:'250px', backgroundSize:'cover', backgroundRepeat:'no-repeat', width:'1000px', margin:'auto', borderRadius:'20px', position:'relative'}}>
            <div style={{ backgroundColor:'#fad0c4', background:"linear-gradient(315deg, rgba(150, 25, 135, 0.288), rgba(241, 167, 241, 0.288))" , height:'250px', borderRadius:'20px'}}> 
            <h3 style={{textAlign:'center', transform:'translateY(100px)'}}> Welcome To The <span style={{color: 'rgb(79, 116, 238)'}}>Vibe</span><span style={{color: 'rgb(146, 235, 95)'}}>Link</span></h3> 
            </div>
        </div>
    )
}

export default Banner;


