import React, { useEffect, useState } from 'react'
import "../styles/Header.css";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import ProfileImg from "../images/profile.jpg";
import MessageIcon from '@material-ui/icons/Message';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/Explore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar } from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from "../redux/actions/authActions";
import {Link, useLocation} from 'react-router-dom';
import {getDataApi} from "../utils/fetchDataApi"
import UserCard from './UserCard';
import LoadIcon from "../images/loading.gif"



export const Header = () =>{
   const [search, setSearch] = useState('')
   const [users,setUsers]=useState([])
   const [load,setLoad] = useState(false)
   
   const dispatch = useDispatch();
   const {auth,notify} = useSelector(state=>state);
   const{pathname} = useLocation();

   useEffect(()=>{
      if(search && auth.token){
         getDataApi(`search?username=${search}`,auth.token)
         .then(res=>setUsers(res.data.users))
         .catch(err=>{
            dispatch({
               type:'ALERT',
               payload:{
                  error: err.response.data.msg
               }
            })
         })
      }else {
         setUsers([])
      }
   },[search,auth.token,dispatch])

    
  



   const isActive = (pn) => {
      return pn === pathname;
   }  

   const handleClose = () => {
      setSearch('');
      setUsers([]);
   } 

   const handleSearch = async (e) =>{
      e.preventDefault();
      if(!search) return;

      try {
         setLoad(true)
         const res = await getDataApi(`search?username=${search}`,auth.token);
         setUsers(res.data.users)
         setLoad(false)
      } catch (err) {
         dispatch({
            type:'ALERT',
            payload:{
               error: err.response.data.msg
            }
         })
      }
      
   }
    return (
     <div className="header">
         <div className="header-right">
            <h3><span style={{color: 'rgb(241, 43, 232)'}}>Vibe</span><span style={{color: 'rgb(146, 235, 95)'}}>Link</span></h3>
         </div>
         <form className="header-center" onSubmit={handleSearch}>
            <input type="text" placeholder="Search Profiles" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <SearchIcon style={{opacity: users.length > 0 ? '0' : '1'}} />
            <span className="header-centersearchclose" onClick={handleClose} style={{opacity: users.length > 0 ? '1' : '0'}}>&times;</span>
            <button type="submit" style={{display:'none'}}>Search</button>
        <div className="header-searchusers">
         {load && <img src={LoadIcon} alt="" style={{width:'48px', height:"48px"}}/>}
         {
            search && users.length > 0 && users.map(user=>(
              
                  <UserCard user={user} handleClose={handleClose}/>
               
            ))
         }
         </div>
         </form>
         <div className="header-left "> 
         <Link to ={`/profile/${auth.user._id}`}> <div className="header-leftAvatar">
         <Avatar src={auth.user.avatar || ProfileImg}/>
                 <h4 style={{color:'white'}}>{auth.user.fullname}</h4>
             </div>
             </Link>
     
             <Link to="/"  >
                
             <IconButton >
             <HomeIcon className={isActive("/") ? "active-class" : ""}/>
             </IconButton>
             </Link>
          
             <Link to="/message">
             <IconButton  >
             <MessageIcon className={isActive("/message") ? "active-class" : ""}/>
            </IconButton>
             </Link>
             <Link to="/notification">
             <IconButton>
                <NotificationsIcon className={isActive("/notification") ? "active-class" : ""}/>
             </IconButton>
             <span style={{position:'absolute', transform:'translate(-26px,16px)',color:'white', fontSize:'10px'}}>{notify && notify.data.length}</span>
             </Link>
             <Link to="/explore">
             <IconButton>
                <ExploreIcon className={isActive("/explore") ? "active-class" : ""}/>
             </IconButton>
             </Link>
             <IconButton onClick={()=>dispatch(logout())}>
                <ExitToAppIcon/>
             </IconButton>
             
         </div>

     </div>

    )
}

export default Header;