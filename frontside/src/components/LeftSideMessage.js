import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getDataApi } from "../utils/fetchDataApi";
import UserCardMessages from './UserCardMessages';
import { AddUser, getConversations } from "../redux/actions/messageActions";
import { useHistory } from "react-router-dom";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import LoadIcon from '../images/loading.gif';

const LeftSideMessage = () => {
    const [search, setSearch] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [load, setLoad] = useState(false);
    const { auth, message } = useSelector(state => state);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!message.firstLoad) {
            dispatch(getConversations({auth}));
        }
    }, [dispatch, auth, message.firstLoad]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) return;

        try {
            setLoad(true);
            const res = await getDataApi(`search?username=${search}`, auth.token);
            setSearchUser(res.data.users);
            setLoad(false);
        } catch (err) {
            console.error(err);
            setLoad(false);
            dispatch({
                type: 'ALERT',
                payload: {
                    error: err.response?.data?.msg || 'Search failed'
                }
            });
        }
    };

    const handleAddChat = (user) => {
        setSearch('');
        setSearchUser([]);
        dispatch(AddUser({user, message}));
        return history.push(`/message/${user._id}`);
    };

    return (
        <div className="leftsidecontent">
            <form className="leftsidecontentsearch" onSubmit={handleSearch}>
                <input 
                    className="leftsidecontentsearchinput" 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Find user for chat"
                />
                <button 
                    className="leftsidecontentsearchbutton" 
                    type="submit"
                    disabled={load}
                >
                    {load ? 'Searching...' : 'Search'}
                </button>
            </form>
           
            <div className="leftsidecontentuserlist">
                {load ? (
                    <img src={LoadIcon} alt="loading" className="loading" />
                ) : (
                    <>
                        {searchUser.length !== 0 ? (
                            searchUser.map((user) => (
                                <div onClick={() => handleAddChat(user)} key={user._id}>
                                    <UserCardMessages user={user} />
                                </div>
                            ))
                        ) : (
                            message.users?.map((user) => (
                                <div onClick={() => handleAddChat(user)} key={user._id}>
                                    <UserCardMessages user={user} msg={true}>
                                        <FiberManualRecordIcon className="online-icon" />
                                    </UserCardMessages>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LeftSideMessage;